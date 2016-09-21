"use strict"

var db = require('../db'),
    formidable = require('formidable');

class Main {

  index(req, res){

    
      res.render('main/index', {user: req.user});

  }
  formAbc(req, res){
	  res.render('main/formAbc', {user: req.user});
  }
}

module.exports = exports = new Main();
