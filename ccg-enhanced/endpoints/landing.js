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
    var input = req.body.donorInput;
    console.log(input);
    var donor = db.get(query.selectAll('donor', 'donorTag'), input, function(err, donor) {
      if(err || donor == undefined) {
        // FIXME: instead of sending to error page, display bootstrap flash alert
        logger.error("Error occured getting donor.");
        console.error("ERROR: " + err);
        return res.sendStatus(500);
      }
      console.log("DONOR ID");
      console.log(donor.id);
      var donorAbcForms = [];
      donorAbcForms = db.all(query.selectAll('embryo_recovery', 'embryoDonorId'), donor.id, function(err, donorAbcForms) {
        if(err || donorAbcForms == undefined) {
          // FIXME: instead of sending to error page, display bootstrap flash alert
          logger.error("Error occured getting donor.");
          console.error(err);
          return res.sendStatus(500);
        }
        var searchResults = [];
        donorAbcForms.forEach(function(form) {
          let donorTag = donor.donorTag;
          let donorName = donor.donorName;
          let freezeDate = form.embryoFreezeDate != null ? form.embryoFreezeDate : "N/A";
          let estrusOnsetDate = form.embryoEstrusOnsetDate != null ? form.embryoEstrusOnsetDate : "N/A";
          let breedDate = form.embryoBreedDate != null ? form.embryoBreedDate : "N/A";
          let recoveryDate = form.embryoRecoveryDate != null ? form.embryoRecoveryDate : "N/A";
          let searchResult = {
            donorTag: donorTag,
            donorName: donorName,
            freezeDate: freezeDate,
            estrusOnsetDate: estrusOnsetDate,
            breedDate: breedDate,
            recoveryDate: recoveryDate
          };
          searchResults.push(searchResult);
        });
        console.log("Search Results", searchResults);
        res.render('search/results', {title: config.landing.home, user: req.user, results: searchResults});
      });
    });

  }




}

module.exports = exports = new Landing();
