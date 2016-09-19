"use strict"

var db = require('../db'),
    formidable = require('formidable');

class Main {

  index(req, res){


      res.render('main/index', {user: req.user});

  }

  test(req, res) {
    res.render('main/test', {user: req.user});
  }

}

module.exports = exports = new Main();
