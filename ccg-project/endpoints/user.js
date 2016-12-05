"use strict"

var db = require('../db'),
    encryption = require('../encryption'),
    formidable = require('formidable'),
    manage_users = "Admin Console",
    randomstring = require("randomstring"),
    nodemailer = require('nodemailer');

/**
 *  This class handles user functions.
 *  @class
 */
 //These are funtions that users have access to.
 //Both admins and std users have access to these.
class User {

  /**
   *  @function confirm
   *  @memberof User
   *  @description Sends to page to confirm a new user.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  confirm(req, res) {
    res.render('user/confirm', {title: "confirm", user: req.user, message: ""});
  }

  /**
   *  @function commitConfirm
   *  @memberof User
   *  @description Updates appropriate fields if new user can be confirmed.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  commitConfirm(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var first = fields.first.toString().trim();
      var second = fields.second.toString().trim();
      var salt = encryption.salt();

      db.get('SELECT * from users WHERE username = ? AND temp_password = ?', fields.username, fields.temporary, (err, row) => {
        console.log(row);
        if(row === null) {
          console.log("Error");
          //redirect to confirm page with an error
          //res.render('admin/edit', {title: manage_users, user: req.user, users:row, message: "Oops!"});
        }

        //a username matches
        if(first === second) {
          //TODO ONLY FOR DEBUGGING
          // console.log("MATCH!");
          // console.log(fields);

          var password = encryption.digest(first + salt);
          db.run('UPDATE users set password_digest = ?, temp_password = ?, salt = ?  where username = ?',
             password,
             null,
             salt,
             fields.username
          );
          //redirect to login
          // res.redirect('/login');
        }


        //if they dont match
        //redirect to confirm page with an error


      });

      // //TODO ONLY FOR DEBUGGING
      // console.log("After Insert:\n");
      // db.get('SELECT * from users WHERE username = ?', fields.username, (err, row) => {
      //
      //   console.log(row);
      //
      // });





    });
    //TODO MAY NOT NEED THIS HERE
    //res send status
    res.redirect("/login");
  }

  //resetPassword(req, res) {
    //TODO
  //}

}
module.exports = exports = new User();
