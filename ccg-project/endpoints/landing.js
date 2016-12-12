"use strict"

const config = require('../config/config.json');

var db = require('../db'),
    formidable = require('formidable');


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
      res.render('landing/index', {title: config.landing.home, user: req.user});
  }


}

module.exports = exports = new Landing();
