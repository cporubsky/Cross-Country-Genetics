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

}

module.exports = exports = new Forms();
