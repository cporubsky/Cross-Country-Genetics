"use strict"

const config = require('../config/config.json');

var db = require('../db');
var formidable = require('formidable');
var logger = require('log4js').getLogger(config.logger);
var query = require('../database/query');
var helper = require('../helpers/helpers');
var S = require('string');

//for testing only
var template = require('../helpers/template');

/**
 *  This class handles admin functions.
 *  @class
 */
class Admin {

  /**
   *  @function index
   *  @memberof Admin
   *  @description Sends admin to page to manage various items.
   *  @param {req} Request - Http Request Object
   *  @param {res} Response - Http Response Object
   *  @instance
   */
  index(req, res) {
    //console.log(new Date().toLocaleString());
    res.render('admin/index', {title: config.admin.console, user: req.user});

  }


  /**
   *  @function viewUsers
   *  @memberof Admin
   *  @description Selects all users from database for admin to view.
   *  @param {req} Request - Http Request Object
   *  @param {res} Response - Http Response Object
   *  @instance
   */
  viewUsers(req, res) {
    logger.info("Admin console accessed.");
    //var user = db.all('SELECT * FROM users', function(err, users){
    var user = db.all(query.selectAll('users','',''), function(err, users){
      if(err) {
        logger.error("Error occured getting all users for admin console.");
        console.error(err);
        return res.sendStatus(500);
      }
    res.render('admin/users', {title: "Users", user: req.user, users: users});
    });
  }

  /**
   *  @function inviteUser
   *  @memberof Admin
   *  @description Sends email to new user, to invite them to set up account.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  inviteUser(req, res) {

    var tempPassword = helper.generateTempPassword();
    var createdBy = req.user.username;
    var createdOnDate = helper.getTimestamp();

    //console.log('In userInvite');
    //parse form and insert data
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      var email = fields.invite_email;
      db.serialize(function() {
        //checks to see if username or email exits
        db.get(query.selectAll('users', 'email'),
          email,
          (err, rows) => {
            if(rows != null) {
              //Email Exits
              logger.error("Email Exists.");
              logger.error("User invitation unsuccessful.");
              //redirect somewhere
            }
          //if we get here, no user exists, insert user
          db.run(query.insert('users', 'email, temp_password, is_verified, createdBy, createdOn, tempPassCreatedOn'),
            email,
            tempPassword,
            false,
            createdBy,
            createdOnDate,
            createdOnDate,
            (err, user) => {
              if(err) {
                //TODO set res status
                //find specific error for logger
                logger.error("Some error 1");
                logger.error("User creation unsuccessful.");
                //return res.render('admin/create', {title: config.admin.console, user: req.user, message: "Oops, an error happened!"});
            }
            var service = config.email.transporter.service;
            var user = config.email.transporter.user;
            var userPassword = config.email.transporter.pass;
            var ok = new Boolean(helper.sendNewUserMail(tempPassword, email, service, user, userPassword));
            if(!ok) {
              logger.error("Error in sending email.");
              return res.redirect('/admin');
            }
            else {
              logger.info("Success! Email sent!");
              logger.info("User creation successful.");
              //console.log("Success! Email sent!");
              return res.redirect('/admin/users');
            }
          }); //end insert
        }); //end check
      }); //end serialize
    }); //end form parsing
  }

  /**
   *  @function deleteUser
   *  @memberof Admin
   *  @description Deletes user out of user table.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  deleteUser(req, res) {
    //console.log(req.session.user_id);
    //console.log(req.params.id);

    //check to see if you are deleting yourself, if you are send to '/admin'
    if (req.session.user_id == req.params.id) {
      console.log("Here");
      res.statusCode = 500;
      //works, but need to fix the users:req.users -> used to fill in form, it right now is blank
      //return res.render('admin/users', {title: config.admin.console, user: req.user, users:req.user, message: "You cannot delete yourself!"});
      return res.redirect('/admin/users'); //<----Only temporary
    }
    else {

      logger.info("User deletion started.");
      db.run(query.delete('users', 'id'), req.params.id, function(err, users){
        if(err) {
          console.error(err);
          logger.error("User deletion unsuccessful.");
          return res.sendStatus(500);
        }
        logger.info("User deletion successful.");
        return res.redirect('/admin/users');
      });
    }
  }



  /**
   *  @function commitEdit
   *  @memberof Admin
   *  @description Updates user in user table with appropriate edits.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  commitEdit(req, res) {
    logger.info("Commit user edit started.");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

      var id = req.params.id;
      var name = fields.name.split(' ');
      var firstName = S(name[0]).capitalize().s;
      var lastName = S(name[1]).capitalize().s;
      var username = fields.username.toLowerCase();
      var email = fields.email.toLowerCase();
      var role = fields.user_role;
      var date = helper.getTimestamp();
      var changedBy = req.user.username;
      if(role === 'Admin') role = 1;
      else if (role === 'User') role = 0;

      db.run(query.update('users', 'first_name, last_name, username, email, is_admin, createdOn, createdBy', 'id'),
        firstName,
        lastName,
        username,
        email,
        role,
        date,
        changedBy,
        id
      );

      logger.info("Commit user edit successful.");
      res.redirect('/admin/users');
    });
  }



}
module.exports = exports = new Admin();
