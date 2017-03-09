"use strict"

var formidable = require('formidable');
var bodyParser = require('body-parser');
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
    // res.render('search/results', {title: config.search.results}, id: req.id, message: "");
    // console.log(req.body);
    // var searchInput = req.body.searchInput;
    // console.log(searchInput);
    // var form = new formidable.IncomingForm();
    console.log("Body, Search Input: ", req.body.searchInput);
    // form.parse(req, function(err, fields, files) {
    //   console.log("Fields", fields.searchInput);
    // });
    res.render('landing/index', {title: config.landing.home, user: req.user, message: ""});
  }
}

module.exports = exports = new Landing();
