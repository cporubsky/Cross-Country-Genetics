"use strict"

var db = require('../db'),
    formidable = require('formidable');

class Admin {

  //lists all users
  index(req, res) {
      //work on this to go to admin page
      //res.render('admin/index', {title: "Admin Index", users: users, user: req.user});
      res.render('admin/index', {title: "Manage Users", user: req.user});
  }


}

module.exports = exports = new Admin();
