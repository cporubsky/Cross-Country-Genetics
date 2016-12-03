"use strict"

var db = require('../db'),
    formidable = require('formidable'),
    manage_users = "Admin Console",
    randomstring = require("randomstring"),
    nodemailer = require('nodemailer');

/**
 *  This class handles admin functions.
 *  @class
 */
class Admin {

  /**
   *  @function index
   *  @memberof Admin
   *  @description Sends admin to page to manage various items.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   */
  index(req, res) {
    var user = db.all('SELECT * FROM users', function(err, users){
      if(err) {
        console.error(err);
        return res.sendStatus(500);
      }
    res.render('admin/users', {title: manage_users, user: req.user, users: users});
    });
  }

  /**
   *  @function createUser
   *  @memberof Admin
   *  @description Sends admin to page to create a user.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   */
  createUser(req, res) {
    res.render('admin/create', {title: manage_users, user: req.user, message: ""});
  }


  /**
   *  @function commitCreateUser
   *  @memberof Admin
   *  @description Inserts user in user table with temp password.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   */
  commitCreateUser(req, res) {

    //generate temp password
    var tempPassword = randomstring.generate({
      length: 12,
      charset: 'alphanumeric'
      });

    //create transporter
    var transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: 'ccgkansas@gmail.com',
        pass: 'ccgkansas1'
      }
    });

    //parse form and insert data
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {

      db.serialize(function() {
        //checks to see if username or email exits
        db.get('SELECT * from users WHERE name = ? or username = ? or email = ?',
          fields.name,
          fields.username,
          fields.email,
          (err, rows) => {
            if(rows != null) {
              //username is taken
              return res.render('admin/create', {title: manage_users, user: req.user, message: "Oops!"});
            }

          //if we get here, no user exists, insert user
          db.run('INSERT INTO users (name, username, email, is_admin, temp_password) values (?,?,?,?,?)',
            fields.name,
            fields.username,
            fields.email,
            fields.role,
            tempPassword,
            (err, user) => {
              if(err) {
                //TODO set res status
                return res.render('admin/create', {title: manage_users, user: req.user, message: "Oops, In Insert!"});
            }
            //TODO change html to better message, fine for now
            transporter.sendMail({
              from: 'CCG Admin <crosscountrygeneticskansas@gmail.com>',
              to: 'corey.porubsky@gmail.com',
              subject: 'Action Required',
              html: '<p> You were added as a new user for Cross Country Genetics. </p>' +
              '<p> Follow the link below, and use your temp password to finish the process.  </p>' +
              '<a href="http://google.com">http://google.com</a>' +
              '<p>' + tempPassword + '</p>'
            }, function(error, info){
              if(error) console.log(error);
              console.log("Success");
            });
            return res.redirect('/admin');
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
   */
  deleteUser(req, res) {
    db.run('DELETE FROM users WHERE id=?', req.params.id, function(err, users){
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
   */
  edit(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      db.get('SELECT * from users WHERE id = ?', req.params.id, (err, row) => {
        //console.log(rows);
        if(row === null) {
          //alert("username taken");
          console.log("Error");
          res.render('admin/edit', {title: manage_users, user: req.user, users:row, message: "Oops!"});
        }
        res.render('admin/edit', {title: manage_users, user: req.user, users:row, message: ""});
      });
    });
  }

  /**
   *  @function commitEdit
   *  @memberof Admin
   *  @description Updates user in user table with appropriate edits.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   */
  commitEdit(req, res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      //console.log(fields)
      db.run('UPDATE users set name = ?, username = ?, email = ?, is_admin = ? where id = ?',
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
