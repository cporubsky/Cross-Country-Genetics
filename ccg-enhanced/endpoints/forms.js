"use strict"

const config = require('../config/config.json');
var db = require('../db');
var formidable = require('formidable');
var bodyParser = require('body-parser');
var logger = require('log4js').getLogger(config.logger);

/**
 *  This class handles forms.
 *  @class
 */
class Forms {

  /**
   *  @function abcForm
   *  @memberof Forms
   *  @description Sends user to ABC form.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  abcForm(req, res){
	  res.render('forms/formAbc', {user: req.user});
  }

  /**
   *  @function firstForm
   *  @memberof Forms
   *  @description Sends user to First form.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  firstForm(req, res){
	  res.render('forms/firstForm', {user: req.user});
  }

  /**
   *  @function donorCowEnrollment
   *  @memberof Forms
   *  @description Sends user to Donor Cow Enrollment form.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  donorCowEnrollment(req, res){
	  res.render('forms/donorCowEnrollment', {user: req.user});
  }

  /**
   *  @function caneCodeLog
   *  @memberof Forms
   *  @description Sends user to Cane Code Log form.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  caneCodeLog(req, res){
	  res.render('forms/caneCodeLog', {user: req.user});
  }

  /**
   *  @function viewForms
   *  @memberof Forms
   *  @description Sends user to view forms.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  viewForms(req, res){
    res.render('forms/viewForms', {user: req.user});
  }

  /**
   *  @function formAbcAjax
   *  @memberof Forms
   *  @description Ajax for ABC form.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  formAbcAjax(req, res){
    console.log(req.body);
    var tag = req.body.tag;
    var owner = req.body.owner;
    console.log(tag);
    console.log(owner);
      db.get("SELECT * FROM client c INNER JOIN donor d ON d.donorClientId=c.id INNER JOIN embryo_recovery e ON e.embryoDonorId=d.id"
      + " INNER JOIN sire s ON s.id=e.embryoSireId AND d.donorTag=? AND c.clientName=?", tag, owner, function(err, rows) {
      //db.get("SELECT * FROM client c INNER JOIN donor d ON d.client_id=c.id INNER JOIN embryo_recovery e ON e.donor_id=d.id"
      //+ " INNER JOIN sire s ON s.id=e.sire_id AND d.tag_tattoo=? AND c.name=?", tag, owner, function(err, rows) {
      if(err) {
        // error handling
        return res.sendStatus(500);
      }
      res.setHeader('content-type', 'text/json');
      res.send(JSON.stringify(rows));
    });
  } //end formAbcAjax

  donorCowEnrollment(req, res){
    if (req.method == 'POST') {
      var idNum = req.body.idNum;
      var owner = req.body.owner;
      console.log(idNum);
      console.log(owner);
      // Create donor test data
      if(idNum != "" && owner != ""){
        db.run("INSERT INTO donor (donorClientId, donorBreed, donorRegNum) values (?,?,?,?,?)",
           idNum,
           req.body.breed,
           req.body.regNum
        );
        db.run("INSERT INTO client (clientName, clientAddress) values (?,?)",
           owner,
           req.body.address
        );
        console.log("Data inserted.");
      }
      else{
        console.log('problem with request: ' + e.message);
      }
    }
    res.render('forms/donorCowEnrollment', {user: req.user});
  }
}


module.exports = exports = new Forms();
