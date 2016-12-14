"use strict"

const config = require('../config/config.json');
var logger = require('log4js').getLogger(config.logger);

/**
 *  This class handles api functions.
 *  @class
 */
class Api {

  /**
   *  @function index
   *  @memberof Api
   *  @description Sends user to api documentation.
   *  @param {req} Request - Http Request Object
   *  @param {res} Response - Http Response Object
   *  @instance
   */
  index(req, res) {
    res.render('./out/index');
  }

}
module.exports = exports = new Api();
