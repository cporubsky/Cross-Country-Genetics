"use strict"

const config = require('../config/config.json');
var encryption = require('../encryption');
var db = require('../db');
var formidable = require('formidable');
var logger = require('log4js').getLogger(config.logger);
var query  = require('../database/query');
var template = require('../helpers/template');

/**
 *  This class handles the encryption for user passwords.
 *  @class
 */
class Session {

  /**
   *  @function redirect
   *  @memberof Session
   *  @description Redirects to login page.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  redirect(req, res) {
      res.writeHead(301, {"Content-Type":"text/html", "Location":"/login"});
      res.end("This page has moved to <a href='/login'>login</a>");
    }

  /**
   *  @function login
   *  @memberof Session
   *  @description Renders a login form with no error message.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  login(req, res) {
    console.log(template.newUserEmail());
    //console.log(query.update('users', 'name, username, email', 'id, and, email, or, username'));
    //console.log(query.update('users', 'name, username, email', 'id'));
    //console.log(query.selectAll('users', 'name, or, username, or, email'));
    //console.log(query.selectAll('users', 'name, or, username, or, email'));
    //console.log(query.selectAll('users', 'username', ''));
    /*console.log(query.update('users', 'password_digest, temp_password, salt', 'username'));
    console.log(query.insert('users', 'name, username, email, is_admin, temp_password'));
    console.log(query.delete('users', 'id'));*/
    res.render('session/login', {title: config.company_name, message: "", user: req.user});
  }

  /**
   *  @function start
   *  @memberof Session
   *  @description Creates a new session, provided the username and password match one in the database.
   *  If login fails, the page will be redirected back to login with error message.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  start(req, res, next) {
    logger.info("New session requested.")
    req.session.reset();
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      //console.log(fields);
      if(err) return res.sendStatus(500);
      db.get(query.selectAll('users', 'username'), fields.username, (err, user) => {
        if(err || !user) {
          logger.error("No user found.");
          logger.error("Session request denied.");
          res.statusCode = 500;
           return res.render('session/login', {title: config.company_name, message: config.user.login_failed, user: req.user});
         }
        if(user.password_digest != encryption.digest(fields.password + user.salt)) {
          logger.error("No user/password match found.");
          logger.error("Session request denied.");
          res.statusCode = 500;
         return res.render('session/login', {title: config.company_name, message: config.user.login_failed, user: req.user});
       }
        logger.info("Session request approved.");
        logger.info("Session starting.")
        req.session.user_id = user.id;
        return res.redirect('/index');
      });
    });
  }

  /**
   *  @function stop
   *  @memberof Session
   *  @description Ends a user session by flushing the session cookie.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  stop(req, res) {
    logger.info("Session stopping.");
    req.session.reset();
    return res.render("session/logout", {title: config.user.logged_out, user: {username: config.user.guest}});
  }


}

module.exports = exports = new Session();
