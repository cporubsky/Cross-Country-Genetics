"use strict"

var db = require('../db'),
    formidable = require('formidable'),
    manage_users = "Manage Users";

class Admin {

  //lists all users
  index(req, res) {
      //work on this to go to admin page
      //res.render('admin/index', {title: "Admin Index", users: users, user: req.user});
      res.render('admin/index', {title: manage_users, user: req.user});
  }


}

module.exports = exports = new Admin();
