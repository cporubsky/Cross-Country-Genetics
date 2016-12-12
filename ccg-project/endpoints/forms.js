"use strict"

var db = require('../db'),
    formidable = require('formidable'),
    bodyParser = require('body-parser');


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
   */
  abcForm(req, res){
	  res.render('forms/formAbc', {user: req.user});
  }

  firstForm(req, res){
	  res.render('forms/firstForm', {user: req.user});
  }

  donorCowEnrollment(req, res){
	  res.render('forms/donorCowEnrollment', {user: req.user});
  }

  caneCodeLog(req, res){
	  res.render('forms/caneCodeLog', {user: req.user});
  }

  viewForms(req, res){
    res.render('forms/viewForms', {user: req.user});
  }

  formAbcAjax(req, res){
    console.log(req.body);
    var tag = req.body.tag;
    var owner = req.body.owner;
    console.log(tag);
    console.log(owner);
      db.get("SELECT * FROM donor a INNER JOIN embryo_recovery b ON b.donor_id = a.id INNER JOIN client c ON c.id=a.client_id AND a.tag_tattoo=? AND a.client_id=?", tag, owner, function(err, rows) {
          //INNER JOIN sire d ON d.donor_id=a.id
      if(err) {
        // error handling
        return res.sendStatus(500);
      }
      res.setHeader('content-type', 'text/json');
      res.send(JSON.stringify(rows));
    });
  }

}

module.exports = exports = new Forms();
