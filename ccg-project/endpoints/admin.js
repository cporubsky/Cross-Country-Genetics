"use strict"

const config = require('../config/config.json');

var db = require('../db'),
    formidable = require('formidable'),
    //manage_users = "Admin Console",
    randomstring = require("randomstring"),
    nodemailer = require('nodemailer');



    function createTransporter() {
      return nodemailer.createTransport({
        service: config.email.transporter.service,
        auth: {
          user: config.email.transporter.user,
          pass: config.email.transporter.pass
        }
      });
    }

    function generateTempPassword() {
      return randomstring.generate({
        length: 12,
        charset: 'alphanumeric'
      });
    }

    function sendMail(trans, tempPass) {
      trans.sendMail({
        from: 'CCG Admin <crosscountrygeneticskansas@gmail.com>',
        to: 'corey.porubsky@gmail.com',
        subject: 'Action Required',
        html: '<p> You were added as a new user for Cross Country Genetics. </p>' +
        '<p> Follow the link below, and use your temp password to finish the process.  </p>' +
        '<a href="http://google.com">http://google.com</a>' +
        '<p>' + tempPass + '</p>'
      }, function(error, info){
        if(error){
          console.log(error);
          return false;
        }
        console.log("Success in sendMail Function");
        return true;
      });
    }

    function selectAllUsers() {
      return 'SELECT * FROM users';
    }

    function selectUserById() {
      return 'SELECT * from users WHERE id = ?';
    }

    function selectUserNotById() {
      return 'SELECT * from users WHERE name = ? or username = ? or email = ?';
    }

    function insertNewUser() {
      return 'INSERT INTO users (name, username, email, is_admin, temp_password) values (?,?,?,?,?)';
    }

    function deleteUserById() {
      return 'DELETE FROM users WHERE id=?';
    }

    function updateUserById() {
      return 'UPDATE users set name = ?, username = ?, email = ?, is_admin = ? where id = ?';
    }


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
    //var user = db.all('SELECT * FROM users', function(err, users){
    var user = db.all(selectAllUsers(), function(err, users){
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
    res.render('admin/users', {title: config.admin.console, user: req.user, users: users});
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
  createUser(req, res) {
    res.render('admin/create', {title: config.admin.console, user: req.user, message: ""});
  }

  /**
   *  @function commitCreateUser
   *  @memberof Admin
   *  @description Inserts user in user table with temp password.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  commitCreateUser(req, res) {

    var tempPassword = generateTempPassword();


    //parse form and insert data
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.serialize(function() {
        //checks to see if username or email exits
        db.get(selectUserNotById(),
          fields.name,
          fields.username,
          fields.email,
          (err, rows) => {
            if(rows != null) {
              //username is taken
              return res.render('admin/create', {title: config.admin.console, user: req.user, message: "Oops!"});
            }
          //if we get here, no user exists, insert user
          db.run(insertNewUser(),
            fields.name,
            fields.username,
            fields.email,
            fields.role,
            tempPassword,
            (err, user) => {
              if(err) {
                //TODO set res status
                return res.render('admin/create', {title: config.admin.console, user: req.user, message: "Oops, In Insert!"});
            }
            var transporter = createTransporter();
            var ok = new Boolean(sendMail(transporter, tempPassword));
            if(!ok) {
              console.log("Error in sending email.");
              return res.redirect('/admin');
            }
            else {
              console.log("Success! Email Sent!");
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
    db.run(deleteUserById(), req.params.id, function(err, users){
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
      return res.redirect('/admin');
    });
  }

  /**
   *  @function edit
   *  @memberof Admin
   *  @description Selects user in user table to edit.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  edit(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.get(selectUserById(), req.params.id, (err, row) => {
        //console.log(rows);
        if(row === null) {
          //alert("username taken");
          console.log("Error");
          res.render('admin/edit', {title: config.admin.console, user: req.user, users:row, message: "Oops!"});
        }
        res.render('admin/edit', {title: config.admin.console, user: req.user, users:row, message: ""});
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
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      //console.log(fields)
      db.run(updateUserById(),
        fields.name,
        fields.username,
        fields.email,
        fields.role,
        req.params.id
      );
      res.redirect('/admin');
    });
  }

  // cancelPasswordRequest(req, res) {
  //
  // }

}
module.exports = exports = new Admin();
