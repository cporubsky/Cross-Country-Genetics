"use strict"

var db = require('../db'),
    formidable = require('formidable');


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
    console.log("In the ajax receive)")
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      console.log(fields);
      db.run('INSERT INTO users (name, username, email, is_admin, is_approved, password_digest, salt, temp_password) VALUES (?,?,?,?,?,?,?,?)',
        "AjaxUser4",
        "user4",
        "user_4@gmail.com",
        true,                                 //is admin
        true,                                 //is approved
        "passwordAjax", //digest
        "hiddenPasswordAjax",                                  //salt
        null
      );
      res.redirect('forms/formAbc');
    });
  }

}

module.exports = exports = new Forms();
