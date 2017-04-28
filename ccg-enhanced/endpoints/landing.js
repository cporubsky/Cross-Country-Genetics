"use strict"

var formidable = require('formidable');
var bodyParser = require('body-parser');
var db = require('../db');
var query = require('../database/query');
const config = require('../config/config.json');
var logger = require('log4js').getLogger(config.logger);

/**
 *  This class handles the landing page.
 *  @class
 */
class Landing {

  /**
   *  @function index
   *  @memberof Landing
   *  @description Sends user to landing page.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  index(req, res){
    res.render('landing/index', {title: config.landing.home, user: req.user, message: ""});
  }

  /**
   * @function search
   * @memberof Landing
   * @description Gets search results based off of id
   * @param {object} Request - Http Request Object
   * @param {object} Response - Http Response Object
   * @instance
   */
  search(req, res) {
    var donorInput = req.body.donorInput;
    var clientInput = req.body.clientInput;
    var searchResults = [];
    // Check inputs
    if (clientInput && !donorInput) {
      // Get client
      db.get(query.selectAll('client', 'clientName'), clientInput, function(err, client) {
        checkError(res, err, client);
        // Get all donors associated with client
        db.get(query.selectAll('donor', 'donorClientId'), client.id, function(err, donors) {
          checkError(res, err, donors);
          if (!(donors instanceof Array))
            donors = [donors];
          donors.forEach(function(donor) {
            let match = createMatch(client.clientName, donor.donorTag, donor.donorName, donor.donorRegNum);
            searchResults.push(match);
          });
          res.render('search/results', {title: config.landing.home, user: req.user, results: searchResults});
        });
      });
    }
    if (donorInput) {
      let donors = [];
      // Do if there is both a donor and client search
      if (clientInput) {
        // Get client data
        db.get(query.selectAll('client', 'clientName'), clientInput, function(err, client) {
          checkError(res, err, client);
          // Get all donors associated with client
          donors = db.get(query.selectAll('donor', 'donorClientId'), client.id, function(err, donors) {
            checkError(res, err, donors);
            if (!(donors instanceof Array))
              donors = [donors];
            console.log(donors);
            donors.forEach(function(donor) {
              let match = createMatch(client.clientName, donor.donorTag, donor.donorName, donor.donorRegNum);
              searchResults.push(match);
            });
            res.render('search/results', {title: config.landing.home, user: req.user, results: searchResults});
          });
        });
      } else {
        // Do if there is only a search using donor tag
        donors = db.get(query.selectAll('donor', 'donorTag'), donorInput, function(err, donors) {
          checkError(res, err, donors);
          if (!(donors instanceof Array))
            donors = [donors];
          donors.forEach(function(donor) {
            // console.log(donor);
            db.get(query.selectAll('client', 'id'), donor.donorClientId, function(err, donorClient) {
              checkError(res, err, donorClient);
              let match = createMatch(donorClient.clientName, donor.donorTag, donor.donorName, donor.donorRegNum);
              searchResults.push(match);
              res.render('search/results', {title: config.landing.home, user: req.user, results: searchResults});
            });
          });
        });
      }
    }

    if (!clientInput && !donorInput) {
      searchResults.push(createMatch('N/A','N/A','N/A','N/A'));
      res.render('search/results', {title: config.landing.home, user: req.user, results: searchResults});
    }

    /**
     * @function createMatch
     * Creates and returns search result match dictionary
     */
    function createMatch(cName, tag, dName, reg) {
      return {
        clientName: cName,
        donorTag: tag,
        donorName: dName,
        donorRegNum: reg
      };
    }

    /**
     * @function checkError
     * Check for error when request is made
     */
    function checkError(res, err, values) {
      if(err || values == undefined) {
        logger.error("Error occured getting donor.");
        console.error("ERROR: " + err);
        return res.sendStatus(500);
      }
    }
  }

  // FIXME: Used for retrieving collection forms
  // donorAbcForms.forEach(function(form) {
  //   let donorTag = donor.donorTag;
  //   let donorName = donor.donorName;
  //   let freezeDate = form.embryoFreezeDate != null ? form.embryoFreezeDate : "N/A";
  //   let estrusOnsetDate = form.embryoEstrusOnsetDate != null ? form.embryoEstrusOnsetDate : "N/A";
  //   let breedDate = form.embryoBreedDate != null ? form.embryoBreedDate : "N/A";
  //   let recoveryDate = form.embryoRecoveryDate != null ? form.embryoRecoveryDate : "N/A";
  //   let searchResult = {
  //     donorTag: donorTag,
  //     donorName: donorName,
  //     freezeDate: freezeDate,
  //     estrusOnsetDate: estrusOnsetDate,
  //     breedDate: breedDate,
  //     recoveryDate: recoveryDate
  //   };
  //   searchResults.push(searchResult);
  // });

}

module.exports = exports = new Landing();
