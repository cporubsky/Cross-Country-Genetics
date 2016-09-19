"use strict"

var db = require('../db'),
    formidable = require('formidable');

class Admin {

  //lists all users
  index(req, res) {
      //work on this to go to admin page
      res.render('admin/index', {users: users, user: req.user});

  }


}

module.exports = exports = new Admin();
