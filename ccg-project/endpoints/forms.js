"use strict"

const config = require('../config/config.json');

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
  } //end formAbcAjax

}

module.exports = exports = new Forms();
