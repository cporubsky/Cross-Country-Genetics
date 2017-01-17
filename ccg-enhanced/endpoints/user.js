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
      db.get(query.selectAll('users', 'username, and, temp_password'), fields.username, fields.temporary, (err, row) => {
        //console.log(row);
        //no such user or temp password
        if(row == null) {
          console.log("Error");
          logger.error("Commit new user unsuccessful.");
          //redirect to confirm page with an error
          res.statusCode = 500;
          return res.render('user/confirm', {title: "Confirm", user: req.user, users:row, message: "Oops, an error happened!"});
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
            return res.render('user/confirm', {title: "Confirm", user: req.user, users:row, message: "Oops, an error happened!"});
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
      var userName = fields.username;
      //check if username matches with temp password
      db.get(query.selectAll('users', 'username'), userName, (err, row) => {
        console.log(row);
        //no such user or temp password
        if(row == null) {
          console.log("Error");
          logger.error("Reset password unsuccessful.");
          //TODO No username -> make error message
          //redirect to reset page with an error
          res.statusCode = 500;
          //send to login screen not showing error to user for security reasons
          //so probably need to fix line directly below this
          return res.render('user/reset_initiate', {title: "Title Here", user: req.user, users:row, message: "Oops, an error happened!"});
        }
        else{
          var tempPassword = helper.generateTempPassword();

          //there is a user, send them a temp password
          var timestamp = helper.getTimestamp();
          console.log(tempPassword);
          console.log(timestamp);
          console.log(userName);
          //TODO need to update temp password, temp password generated date
          db.run(query.update('users', 'temp_password, tempPassCreatedOn', 'username'),
            tempPassword,
            timestamp,
            userName,
            (err, user) => {
              if(err) {
                logger.error("Reset password unsuccessful.");
                //TODO set res status
                return res.render('session/login', {title: "Title Here", user: req.user, message: "Error, In Insert!"});
            }

            //for testing purposes only
            var testEmail = 'ccgtestkansas@gmail.com';
            //var transporter = helper.createTransporter();
            var ok = new Boolean(helper.sendResetMail(tempPassword, testEmail));
            if(!ok) {
              logger.error("Error in sending email.");
              console.log("Error in sending email.");
              res.statusCode = 500;
              return res.render('user/reset_initiate', {title: '', user: req.user, users:row, message: "Oops, an error happened!"});
            }
            else {
              logger.info("Success! Email sent!");
              logger.info("Reset password successful.");
              console.log("Success! Email sent!");
              //TODO add message like -> "Success! Please log in!"
              req.session.sessionFlash = {
                type: 'danger',
                message: 'Password reset email has been sent.'
              }
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
  reset(req, res) {
    //TODO add title
    return res.render("user/reset_initiate", {title: "Reset Password", user: {username: "Guest"}, message: ""});
  }

  resetCommit(req, res) {

      //look up username and compare it with token to validate
      //then compare passwords to make sure that they match
      //then redirect to login with message that it was successful or not
      console.log("Commit password reset.");

      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
        console.log(fields);
        var token = req.params.token;
        var username = fields.username.toLowerCase();
        var password1 = fields.password;
        var password2 = fields.confirm_password;
        // console.log("Token: " + token);
        // console.log("Username: " + username);
        // console.log("Password1: " + password1);
        // console.log("Password2: " + password2)
        db.get(query.selectAll('users', 'username, and, temp_password'), username, token, (err, user) => {
          if(err) {
            console.log(err);
          }
          else {
            //console.log(user);
            if((user.username === username) && (user.temp_password === token)) {
              var userTimestamp = user.tempPassCreatedOn;
              var currTimestamp = helper.getTimestamp();

              // console.log('userTimestamp: ' + userTimestamp);
              // console.log('currTimestamp: ' + currTimestamp);
              var date1 = new Date(userTimestamp);
              var date2 = new Date(currTimestamp);

              var diff = date2.valueOf() - date1.valueOf();
              var diffInHours = diff/1000/60/60; // Convert milliseconds to hours
              console.log('Hours diff: ' + diffInHours);

              if(diffInHours >= 24) {
                console.log("More than 24hrs.");
                req.session.sessionFlash = {
                  type: 'danger',
                  message: 'Password reset token has expired. Please request a new one if needed.'
                }
                res.redirect('/login');

              }
              else {

                console.log("Everything Matches In Database.");
                if(password1 === password2) {
                  console.log("Passwords match.");
                  //update fields, clear out: temp_password, tempPassCreatedOn
                  //update new password
                }
                else {
                  console.log("Passwords dont match.");
                }
              }



            }
            else {
              //put msg here like: An error occured
              res.redirect('/login');
            }
          }



        }); //end db.get
      });
  }

  edit(req, res) {
    // res.render('user/edit_user', {title: "Account Details", user: req.user, users:req.user, message: ""});
    res.render('user/user_acct', {title: "Account Details", user: req.user, message: ""});
  }

  //TODO Implement!!
  commitEdit(req, res) {
    console.log('Commit Edit.');
    console.log(req.params.id);
  }





  verifyToken(req, res) {
    req.session.reset();
    var token = req.params.token;
    db.get(query.selectAll('users','temp_password'), token, function(err, user) {
      if(err) {
        logger.error("Error occured validating token.");
        console.error(err);
        return res.sendStatus(500);
      }

      var userTimestamp = user.tempPassCreatedOn;
      var currTimestamp = helper.getTimestamp();

      console.log('userTimestamp: ' + userTimestamp);
      console.log('currTimestamp: ' + currTimestamp);
      var date1 = new Date(userTimestamp);
      var date2 = new Date(currTimestamp);

      var diff = date2.valueOf() - date1.valueOf();
      var diffInHours = diff/1000/60/60; // Convert milliseconds to hours
      console.log('Hours diff: ' + diffInHours);

      if(diffInHours >= 24) {
        console.log("More than 24hrs.");
        req.session.sessionFlash = {
          type: 'danger',
          message: 'Password reset token has expired. Please request a new one if needed.'
        }
        res.redirect('/login');

      }
      else {

        if(user.is_verified) {
          console.log("Less than 24hrs.");
          res.render('user/reset_complete', {title: "Account Details", user: user, message: ""});
        }
        else {
          console.log("Less than 24hrs.");
          res.render('user/user_acct', {title: "Account Details", user: user, message: ""});
        }
      }
    });
  }

  commitNewUser(req, res) {
    console.log("Commit new user.");

    //for inspiration
    /*commitCreateUser(req, res) {
      logger.info("User creation started.");

      var tempPassword = helper.generateTempPassword();


      //parse form and insert data
      var form = new formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
        db.serialize(function() {
          //checks to see if username or email exits
          //possibly check for first and last name as well
          db.get(query.selectAll('users', 'username, or, email'),
            fields.username,
            fields.email,
            (err, rows) => {
              if(rows != null) {
                //username is taken
                logger.error("Username is taken.");
                logger.error("User creation unsuccessful.");
                return res.render('admin/create', {title: config.admin.console, user: req.user, message: "Oops, an error happened!"});
              }
            //if we get here, no user exists, insert user
            db.run(query.insert('users', 'first_name, last_name, email, is_admin, temp_password'),
              fields.first_name,
              fields.last_name,
              fields.email,
              fields.role,
              tempPassword,
              (err, user) => {
                if(err) {
                  //TODO set res status
                  //find specific error for logger
                  logger.error("Some error 1");
                  logger.error("User creation unsuccessful.");
                  return res.render('admin/create', {title: config.admin.console, user: req.user, message: "Oops, an error happened!"});
              }
              //for testing purposes only
              var testEmail = 'ccgtestkansas@gmail.com';
              //var transporter = helper.createTransporter();
              //template.test2();
              var ok = new Boolean(helper.sendMail(tempPassword, testEmail, 'new'));
              if(!ok) {
                logger.error("Error in sending email.");
                console.log("Error in sending email.");
                return res.redirect('/admin');
              }
              else {
                logger.info("Success! Email sent!");
                logger.info("User creation successful.");
                console.log("Success! Email sent!");
                return res.redirect('/admin');
              }
            }); //end insert
          }); //end check
        }); //end serialize
      }); //end form parsing
    } //end commitCreateUser
    */




    //eventually clear session, and redirect to login
  }





}
module.exports = exports = new User();
