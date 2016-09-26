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


}

module.exports = exports = new Forms();
