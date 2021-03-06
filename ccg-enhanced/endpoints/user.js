"use strict"

const config = require('../config/config.json');
var logger = require('log4js').getLogger(config.logger);
var db = require('../db');
var encryption = require('../encryption');
var formidable = require('formidable');
var query  = require('../database/query');
var helper = require('../helpers/helpers');
var S = require('string');
//test
var moment = require('moment');

/**
 *  This class handles user functions.
 *  @class
 */
 //These are funtions that users have access to.
 //Both admins and std users have access to these.
class User {

  /**
   *  @function resetEmail
   *  @memberof User
   *  @description Updates appropriate fields, sets temp password.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
   resetEmail(req, res) {
     logger.info("Reset password started.");

     var form = new formidable.IncomingForm();
     form.parse(req, function(err, fields, files) {
       var username = fields.username;
       //check if username exists
       db.get(query.selectAll('users', 'username'), username, (err, row) => {
        //  console.log("Row: " + row);
         //no such user
         if(row == null) {
           req.session.sessionFlash = {
             type: 'danger',
             message: 'There was an error.'
           }
           return res.redirect('/login');
         }
         else {


         var timestamp = helper.getTimestamp();
         var tempPassword = helper.generateTempPassword();
         db.run(query.update('users', 'temp_password, tempPassCreatedOn, createdBy, createdOn', 'username'),
           tempPassword,
           timestamp,
           username,
           timestamp,
           username,
           (err, users) => {
             if(err) {
               req.session.sessionFlash = {
                 type: 'danger',
                 message: 'Error in resetEmail update.'
               }
               return res.redirect('/login');
           }
           //for testing purposes only
           var testEmail = 'ccgtestkansas@gmail.com';
           var service = config.email.transporter.service;
           var user = config.email.transporter.user;
           var userPassword = config.email.transporter.pass;
           var ok = new Boolean(helper.sendResetMail(tempPassword, testEmail, service, user, userPassword));
           if(!ok) {
             res.statusCode = 500;
             req.session.sessionFlash = {
               type: 'danger',
               message: 'There was an error sending the email.'
             }
             return res.redirect('/login');
           }
           else {
             req.session.sessionFlash = {
               type: 'danger',
               message: 'Password reset email has been sent.'
             }
             return res.redirect('/login');
           }
         }); //end update
       }
     }); //end selectall
   }); //end form parse
 } //end resetPassword


  /**
   *  @function reset
   *  @memberof User
   *  @description Sends to page to send user an email to reset password.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  reset(req, res) {
    //TODO add title
    return res.render("user/reset_initiate", {title: "Reset Password", user: {username: "Guest"}, message: ""});
  }

  /**
   *  @function resetCommit
   *  @memberof User
   *  @description Commits new password to database for resetting password.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  resetCommit(req, res) {

      //look up username and compare it with token to validate
      //then compare passwords to make sure that they match
      //then redirect to login with message that it was successful or not
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
        var token = req.params.token;
        var username = fields.username.toLowerCase();
        var password1 = fields.password;
        var password2 = fields.confirm_password;
        db.get(query.selectAll('users', 'username, and, temp_password'), username, token, (err, user) => {
          if(err) {
            // console.log(err);
            //handle error
          }
          else {
            if((user.username === username) && (user.temp_password === token)) {
              var userTimestamp = user.tempPassCreatedOn;
              var currTimestamp = helper.getTimestamp();
              var date1 = new Date(userTimestamp);
              var date2 = new Date(currTimestamp);
              var diff = date2.valueOf() - date1.valueOf();
              var diffInHours = diff/1000/60/60; // Convert milliseconds to hours

              if(diffInHours >= 24) {
                req.session.sessionFlash = {
                  type: 'danger',
                  message: 'Password reset token has expired. Please request a new one if needed.'
                }
                res.redirect('/login');
              }
              else {
                if(password1 === password2) {
                  var salt = encryption.salt();
                  db.run(query.update('users', 'temp_password, tempPassCreatedOn, password_digest, salt, createdBy, createdOn', 'username'),
                    null,
                    null,
                    encryption.digest(password1 + salt),
                    salt,
                    username,
                    currTimestamp,
                    username,
                    (err, user) => {
                      if(err) {
                        logger.error("Reset password unsuccessful.");
                        req.session.sessionFlash = {
                          type: 'danger',
                          message: 'Password reset token has expired. Please request a new one if needed.'
                        }
                        res.redirect('/login');
                    }
                    req.session.sessionFlash = {
                      type: 'danger',
                      message: 'Password reset successfully.\n Please sign in.'
                    }
                    res.redirect('/login');
                  });
                }
                else {
                  //TODO Implement route when passwords don't match
                  // console.log("Passwords dont match.");
                }
              }
            }
            else {
              //TODO Put msg here like: An error occured
              //username or token don't match
              res.redirect('/login');
            }
          }
        }); //end db.get
      }); //end parse form
  }

  /**
   *  @function edit
   *  @memberof User
   *  @description Sends to page to edit user account.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  edit(req, res) {
    res.render('user/user_acct', {title: "Account Details", user: req.user, message: ""});
  }

  /**
   *  @function commitEdit
   *  @memberof User
   *  @description Commits edit of user to database.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  commitEdit(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if(err){
        // console.log(err);
        // handle error
      }
      var firstname = fields.first_name;
      var lastname = fields.last_name;
      var email = fields.email;
      var username = fields.username;
      var password1 = fields.password1;
      var password2 = fields.password2;
      var currTimestamp = helper.getTimestamp();

      if((password1 === '') || (password2 === '')) {
        db.run(query.update('users', 'first_name, last_name, username, email, createdBy, createdOn', 'id'),
          firstname,
          lastname,
          username,
          email,
          'USER',
          currTimestamp,
          req.user.id,
          (err, user) => {
            if(err) {
              res.statusCode = 500;
              res.render('landing/index', {title: config.landing.home, user: req.user, message: "An error occured."});
          }
          req.session.sessionFlash = {
            type: 'danger',
            message: 'Your information has been updated successfully.'
          }
          //this refreshes the page, but need to find a way to do that better.
          res.redirect('/index');

        });
      }
      else {
        var salt = encryption.salt();
        if(password1 === password2) {

          db.run(query.update('users', 'first_name, last_name, username, email, password_digest, salt, createdBy, createdOn', 'id'),
            firstname,
            lastname,
            username,
            email,
            encryption.digest(password1 + salt),
            salt,
            'USER',
            currTimestamp,
            req.user.id,
            (err, user) => {
              if(err) {
                res.statusCode = 500;
                res.render('landing/index', {title: config.landing.home, user: req.user, message: "An error occured."});
            }
            req.session.sessionFlash = {
              type: 'danger',
              message: 'Your information has been updated successfully.'
            }
            //this refreshes the page, but need to find a way to do that better.
            res.redirect('/index');
          });
        }
        else {
          res.statusCode = 500;
          res.render('user/user_acct', {title: "Account Information", user: req.user, message: "An error occured."});
        }
      }
    }); //end parse form
  }

  /**
   *  @function verifyToken
   *  @memberof User
   *  @description Verifies token to create new user or reset a password.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  verifyToken(req, res) {
    req.session.reset();
    var token = req.params.token;
    db.get(query.selectAll('users','temp_password'), token, function(err, user) {
      if(err) {
        logger.error("Error occured validating token.");
        // console.error(err);
        return res.sendStatus(500);
      }
      var userTimestamp = user.tempPassCreatedOn;
      var currTimestamp = helper.getTimestamp();
      var date1 = new Date(userTimestamp);
      var date2 = new Date(currTimestamp);

      var diff = date2.valueOf() - date1.valueOf();
      var diffInHours = diff/1000/60/60; // Convert milliseconds to hours

      if(diffInHours >= 24) {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'Password reset token has expired. Please request a new one if needed.'
        }
        res.redirect('/login');
      }
      else {

        if(user.is_verified) {
          res.render('user/reset_complete', {title: "Account Details", user: user, message: ""});
        }
        else {
          res.render('user/user_acct', {title: "Account Details", user: user, message: ""});
        }
      }
    });
  }

  /**
   *  @function commitNewUser
   *  @memberof User
   *  @description Commits new user to database.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  commitNewUser(req, res) {
    // console.log("Commit new user.");
    var form = new formidable.IncomingForm();
    var salt = encryption.salt();
    form.parse(req, function(err, fields, files) {
      if(err){
        // console.log(err);
        // handle error here
      }
      var firstname =  fields.first_name;
      var lastname = fields.last_name;
      var username = fields.username;
      var email = fields.email;
      var password1 = fields.password1;
      var password2 = fields.password2;
      var currTimestamp = helper.getTimestamp();

      if(password1 === password2) {
        db.run(query.update('users', 'first_name, last_name, username, email, is_admin, \
        password_digest, salt, temp_password, tempPassCreatedOn, is_verified, createdBy, createdOn, secretHash','email'),
          firstname,
          lastname,
          username,
          email,
          false,
          encryption.digest(password1 + salt),
          salt,
          null,
          null,
          true,
          'USER',
          currTimestamp,
          salt,
          email);
          var service = config.email.transporter.service;
          var user = config.email.transporter.user;
          var userPassword = config.email.transporter.pass;
          var ok = new Boolean(helper.sendNewUserMail('', email, service, user, userPassword));
          if(!ok) {
            logger.error("Error in sending email.");
            req.session.sessionFlash = {
              type: 'danger',
              message: 'An error has occured.'
            }
            return res.redirect('/login');
          }
          else {
            logger.info("Success! Email sent!");
            logger.info("User creation successful.");
            req.session.sessionFlash = {
              type: 'success',
              message: 'Success! You may log in now!'
            }
            return res.redirect('/login');
          }
      }
      else {
        req.session.sessionFlash = {
          type: 'danger',
          message: 'An error has occured.'
        }
        return res.redirect('/login');
      }
    }); //end parse form

  }


}
module.exports = exports = new User();
