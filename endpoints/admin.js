"use strict"

var db = require('../db'),
    formidable = require('formidable'),
    manage_users = "Manage Users";

/**
 *  This class handles admin functions.
 *  @class
 */
class Admin {

  /**
   *  @function index
   *  @memberof Admin
   *  @description Sends admin to page to manage various items.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   */
  index(req, res) {
      //uncomment if we simply list users on this page
      //res.render('admin/index', {title: "Admin Index", users: users, user: req.user});
      res.render('admin/index', {title: manage_users, user: req.user});
  }


}

module.exports = exports = new Admin();
