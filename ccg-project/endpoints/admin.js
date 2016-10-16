"use strict"

var db = require('../db'),
    formidable = require('formidable'),
    manage_users = "Admin Console";

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
    var user = db.all('SELECT * FROM users', function(err, users){
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
    res.render('admin/users', {title: manage_users, user: req.user, users: users});
    });
  }

  createUser(req, res) {
    res.render('admin/create', {title: manage_users, user: req.user});
  }

}
module.exports = exports = new Admin();
