"use strict"

var db = require('../db'),
    formidable = require('formidable'),
    manage_users = "Admin Console",
    randomstring = require("randomstring"),
    nodemailer = require('nodemailer');

/**
 *  This class handles user functions.
 *  @class
 */
class User {

  confirm(req, res) {
    res.render('user/confirm', {title: "confirm", user: req.user, message: ""});
  }

  commitConfirm(req, res) {
    //Commit changes here
    //console.log(req.params.id);
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if(fields.first.toString().trim() === fields.second.toString().trim()) {
        console.log(fields)
        db.run('UPDATE users set password = ?, set temp_password = ?  where username = ?',
          //set temp_password to null
          fields.name,
          fields.username,
          fields.email,
          fields.role,
          req.params.id
        );
        //redirect to login
        res.redirect('/login');
      }

      //if they dont match

    });
  }

}
module.exports = exports = new User();
