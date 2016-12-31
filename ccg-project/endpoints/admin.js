"use strict"

const config = require('../config/config.json');

var db = require('../db');
var formidable = require('formidable');
var logger = require('log4js').getLogger(config.logger);
var query = require('../database/query');
var helper = require('../helpers/helpers');

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

    res.render('admin/index', {title: config.admin.console, user: req.user});

  }


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
   *  @function createUser
   *  @memberof Admin
   *  @description Sends admin to page to create a user.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  /*createUser(req, res) {
    res.render('admin/create', {title: "Create User", user: req.user, message: ""});
  }*/

  /**
   *  @function commitCreateUser
   *  @memberof Admin
   *  @description Inserts user in user table with temp password.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  commitCreateUser(req, res) {
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

  /**
   *  @function deleteUser
   *  @memberof Admin
   *  @description Deletes user out of user table.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  deleteUser(req, res) {
    console.log(req.session.user_id);
    console.log(req.params.id);

    if (req.session.user_id == req.params.id) {
      console.log("Here");
      res.statusCode = 500;
      //works, but need to fix the users:req.users -> used to fill in form, it right now is blank
      return res.render('admin/edit', {title: config.admin.console, user: req.user, users:req.user, message: "You cannot delete yourself!"});

    }
    var user = db.all(query.selectAll('users','id',''), req.params.id, function(err, users){
      if(err) {
        logger.error("Error occured getting all users for admin console.");
        console.error(err);
        return res.sendStatus(500);
      }
    res.render('admin/users', {title: config.admin.console, user: req.user, users: users});
    });

    //check to see if you are deleting yourself, if you are send to '/admin'
    /*logger.info("User deletion started.");
    db.run(query.delete('users', 'id'), req.params.id, function(err, users){
      if(err) {
        console.error(err);
        logger.error("User deletion unsuccessful.");
        return res.sendStatus(500);
      }
      logger.info("User deletion successful.");
      return res.redirect('/admin');
    });*/
  }

  /**
   *  @function edit
   *  @memberof Admin
   *  @description Selects user in user table to edit.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
   //'SELECT * from users WHERE id = ?'
  edit(req, res) {
    logger.info("Get user to edit started.");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.get(query.selectAll('users', 'id', ''), req.params.id, (err, row) => {
        //console.log(rows);
        if(row === null) {
          //alert("username taken");
          logger.error("Get user to edit unsuccessful.");
          console.log("Error");
          res.render('admin/edit', {title: "Edit User", user: req.user, users:row, message: "Oops, an error happened!"});
        }
        logger.info("Get user to edit successful.");
        res.render('admin/edit', {title: "Edit User", user: req.user, users:row, message: ""});
      });
    });
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
      //console.log(fields)
      db.run(query.update('users', 'first_name, last_name, username, email, is_admin', 'id'),
        fields.first_name,
        fields.last_name,
        fields.username,
        fields.email,
        fields.role,
        req.params.id
      );
      logger.info("Commit user edit successful.");
      res.redirect('/admin');
    });
  }

  // cancelPasswordRequest(req, res) {
  //
  // }



}
module.exports = exports = new Admin();
