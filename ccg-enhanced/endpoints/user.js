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
        console.log("Row: " + row);
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

          console.log("Email to be sent to: " + row.email);
          //for testing purposes only
          var testEmail = 'ccgtestkansas@gmail.com';
          var ok = new Boolean(helper.sendResetMail(tempPassword, testEmail));
          //var ok = new Boolean(helper.sendResetMail(tempPassword, row.email));
          if(!ok) {
            res.statusCode = 500;
            req.session.sessionFlash = {
              type: 'danger',
              message: 'There was an error sending the email.'
            }
            return res.redirect('/login');
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
      }); //end parse form
  }

  edit(req, res) {
    // res.render('user/edit_user', {title: "Account Details", user: req.user, users:req.user, message: ""});
    res.render('user/user_acct', {title: "Account Details", user: req.user, message: ""});
  }

  //TODO Implement!!
  commitEdit(req, res) {
    console.log('Commit Edit.');
    console.log(req.params.id);
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if(err){
        console.log(err);
      }
      var firstname = fields.first_name;
      var lastname = fields.last_name;
      var email = fields.email;
      var username = fields.username;
      var password1 = fields.password1;
      var password2 = fields.password2;
      var currTimestamp = helper.getTimestamp();

      if((password1 === '') || (password2 === '')) {
        console.log("One of the passwords are blank.");
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
        console.log("in else.");
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

  verifyToken(req, res) {
    req.session.reset();
    var token = req.params.token;
    db.get(query.selectAll('users','temp_password'), token, function(err, user) {
      if(err) {
        logger.error("Error occured validating token.");
        console.error(err);
        return res.sendStatus(500);
      }
      console.log('In verifyToken:');
      console.log(user);

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
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if(err){
        console.log(err);
      }
      var firstname =  fields.first_name;
      var lastname = fields.last_name;
      var username = fields.username;
      var email = fields.email;
      var password1 = fields.password1;
      var password2 = fields.password2;
      var currTimestamp = helper.getTimestamp();




      console.log("First name: " + firstname);
      console.log("Last name: " + lastname);
      console.log("Username: " + username);
      console.log("Email: " + email);
      console.log("Password1: " + password1);
      console.log("Password2: " + password2);

      if(password1 === password2) {
        console.log('Match!')
      }
      else {
        console.log('Dont Match!');
      }
      console.log("Current Time: " + currTimestamp);

    }); //end parse form
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
