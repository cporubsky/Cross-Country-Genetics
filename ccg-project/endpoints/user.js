"use strict"

const config = require('../config/config.json');
var logger = require('log4js').getLogger(config.logger);

var db = require('../db'),
    encryption = require('../encryption'),
    formidable = require('formidable'),
    manage_users = "Admin Console",
    randomstring = require("randomstring"),
    nodemailer = require('nodemailer');


    var query  = require('../database/query');
    var helper = require('../helpers/helpers');

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
    logger.info("Commit new user started.");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var first = fields.first.toString().trim();
      var second = fields.second.toString().trim();
      var salt = encryption.salt();

      //check if username matches with temp password
      db.get(query.selectAllConditions('users', 'username, temp_password', 'AND'), fields.username, fields.temporary, (err, row) => {
        //console.log(row);
        //no such user or temp password
        if(row == null) {
          console.log("Error");
          logger.error("Commit new user unsuccessful.");
          //redirect to confirm page with an error
          res.statusCode = 500;
          return res.render('user/confirm', {title: manage_users, user: req.user, users:row, message: "Oops!"});
        }
        else{
          //check if both new passwords match
          if(first === second) {
            var password = encryption.digest(first + salt);
            db.run(query.update('users', 'password_digest, temp_password, salt', 'username'),
               password,
               null,
               salt,
               fields.username
            );
            logger.info("Commit new user successful.");
            return res.redirect('/login');
          }
          //they don't match
          else {
            logger.error("Commit new user unsuccessful.");
            //redirect to confirm page with an error
            res.statusCode = 500;
            return res.render('user/confirm', {title: manage_users, user: req.user, users:row, message: "Oops!"});
          }
        }
      });

      // //TODO ONLY FOR DEBUGGING
      // console.log("After Insert:\n");
      // db.get('SELECT * from users WHERE username = ?', fields.username, (err, row) => {
      //
      //   console.log(row);
      //
      // });
    });
  } //end commitConfirm


  /**
   *  @function resetPassword
   *  @memberof User
   *  @description Updates appropriate fields if user can be confirmed to reset password.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  resetPassword(req, res) {
    logger.info("Reset password started.");

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var userName = fields.username;
      //check if username matches with temp password
      db.get(query.selectAllConditions('users', 'username', 'NOT_USED'), userName, (err, row) => {
        console.log(row);
        //no such user or temp password
        if(row == null) {
          console.log("Error");
          logger.error("Reset password unsuccessful.");
          //TODO No username -> make error message
          //redirect to reset page with an error
          res.statusCode = 500;
          return res.render('user/reset', {title: manage_users, user: req.user, users:row, message: "Oops!"});
        }
        else{
          var tempPassword = helper.generateTempPassword();

          //there is a user, send them a temp password

          //TODO need to update temp password, update password to NULL
          db.run(query.update('users', 'password_digest, temp_password, salt', 'username'),
            null,
            tempPassword,
            null,
            userName,
            (err, user) => {
              if(err) {
                logger.error("Reset password unsuccessful.");
                //TODO set res status
                return res.render('admin/create', {title: manage_users, user: req.user, message: "Oops, In Insert!"});
            }

            //for testing purposes only
            var testEmail = 'corey.porubsky@gmail.com';
            var transporter = helper.createTransporter();
            var ok = new Boolean(helper.sendMail(transporter, tempPassword, testEmail));
            if(!ok) {
              logger.error("Error in sending email.");
              console.log("Error in sending email.");
              res.statusCode = 500;
              return res.render('user/reset', {title: '', user: req.user, users:row, message: "Oops!"});
            }
            else {
              logger.info("Success! Email sent!");
              logger.info("Reset password successful.");
              console.log("Success! Email sent!");
              //TODO add message like -> "Success! Please log in!"
              return res.redirect('/login');
            }
          }); //end insert
        }
      });


    });

  } //end resetPassword


  /**
   *  @function reset
   *  @memberof User
   *  @description Sends to page to send user an email to reset password.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  reset(req, res){
    //TODO add title
    return res.render("user/reset", {title: "Title Here", user: {username: "Guest"}, message: ""});
  }



}
module.exports = exports = new User();
