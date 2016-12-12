"use strict"

const config = require('../config/config.json');
var logger = require('log4js').getLogger(config.logger);

var db = require('../db'),
    encryption = require('../encryption'),
    formidable = require('formidable'),
    manage_users = "Admin Console",
    randomstring = require("randomstring"),
    nodemailer = require('nodemailer');




    function selectUserByUNameTemp() {
      return 'SELECT * from users WHERE username = ? AND temp_password = ?';
    }

    function updateUserCommit() {
      return 'UPDATE users set password_digest = ?, temp_password = ?, salt = ?  where username = ?';
    }

    //has one in session.js also
    function selectUserByUsername() {
      return 'SELECT * FROM users WHERE username = ?';
    }


/**
 *  This class handles user functions.
 *  @class
 */
 //These are funtions that users have access to.
 //Both admins and std users have access to these.
class User {

  /*function generateTempPassword () {
    //generate temp password
    var temp;
    temp = randomstring.generate({
      length: 12,
      charset: 'alphanumeric'
      });
      return temp;
  }*/

  /*function createTransporter () {
    //create transporter
     var transporter;
    transporter =  nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'ccgkansas@gmail.com',
        pass: 'ccgkansas1'
      }
    });
    return transporter;
  }*/

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
      db.get(selectUserByUNameTemp(), fields.username, fields.temporary, (err, row) => {
        console.log(row);
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
            db.run(updateUserCommit(),
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



  /*sendEmail(transporter, tempPassword){
    //TODO change html to better message, fine for now
    transporter.sendMail({
      from: 'CCG Admin <crosscountrygeneticskansas@gmail.com>',
      to: 'corey.porubsky@gmail.com',
      subject: 'Action Required',
      html: '<p> You requested to reset your password for Cross Country Genetics. </p>' +
      '<p> Follow the link below, and use your temp password to finish the process.  </p>' +
      '<a href="http://google.com">http://google.com</a>' +
      '<p>' + tempPassword + '</p>'
    }, function(error, info){
      if(error) console.log(error);
      console.log("Success");
    });
  }*/


  resetPassword(req, res) {
    logger.info("Reset password started.");

    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var userName = fields.username;


      //check if username matches with temp password
      db.get(selectUserByUsername(), userName, (err, row) => {
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
          //console.log("Reset email sent!");
          var tempPassword = randomstring.generate({
            length: 12,
            charset: 'alphanumeric'
            });

          var transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: 'ccgkansas@gmail.com',
              pass: 'ccgkansas1'
            }
          });
          //there is a user, send them a temp password
          //sendMail(transporter, tempPassword);


          //Formally:
          //'UPDATE users set temp_password = ?, password_digest = ?, salt = ? where username = ?'
          //tempPassword,
          //null,
          //null,
          //userName,

          //'UPDATE users set password_digest = ?, temp_password = ?, salt = ?  where username = ?'
          //TODO need to update temp password, update password to NULL
          db.run(updateUserCommit(),
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

            //sendMail(transporter, tempPassword);

            //TODO change html to better message, fine for now
            transporter.sendMail({
              from: 'CCG Admin <crosscountrygeneticskansas@gmail.com>',
              to: 'corey.porubsky@gmail.com',
              subject: 'Action Required',
              html: '<p> You requested to reset your password for Cross Country Genetics. </p>' +
              '<p> Follow the link below, and use your temp password to finish the process.  </p>' +
              '<a href="http://google.com">http://google.com</a>' +
              '<p>' + tempPassword + '</p>'
            }, function(error, info){
              if(error) console.log(error);
              console.log("Success");
            });
            logger.info("Reset password successful.");
            //TODO add message like -> "Success! Please log in!"
            return res.redirect('/login');
          }); //end insert

        }
      });


    });

  }

  reset(req, res){
    //TODO add title
    return res.render("user/reset", {title: "Title Here", user: {username: "Guest"}, message: ""});
  }



}
module.exports = exports = new User();
