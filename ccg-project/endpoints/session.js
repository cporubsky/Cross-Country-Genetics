"use strict"

var encryption = require('../encryption'),
    db = require('../db'),
    formidable = require('formidable'),
    company_name = "Cross Country Genetics",
    logged_out = "Logged Out!",
    login_failed = "Login Failed. Please try again.",
    guest = "Guest";


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
   */
  login(req, res) {
    res.render('session/login', {title: company_name, message: "", user: req.user});
  }

  /**
   *  @function start
   *  @memberof Session
   *  @description Creates a new session, provided the username and password match one in the database.
   *  If login fails, the page will be redirected back to login with error message.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   */
  start(req, res, next) {
    req.session.reset();
    var form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
      if(err) return res.sendStatus(500);
      db.get("SELECT * FROM users WHERE username = ?", fields.username, (err, user) => {
        if(user){
          console.log();
          console.log("User info in database:");
          console.log(user); //for testing only
          console.log();
          console.log("Password Encryption:");
          console.log("Plain text: " + fields.password);
          console.log("Salt: " + user.salt);
          console.log("Password Digest: " + user.password_digest);
        }

        if(err) return res.render('session/login', {title: company_name, message: login_failed, user: req.user});
        if(!user) return res.render('session/login', {title: company_name, message: login_failed, user: req.user});
        if(user.password_digest != encryption.digest(fields.password + user.salt))
         return res.render('session/login', {title: company_name, message: login_failed, user: req.user});
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
   */
  stop(req, res) {
    req.session.reset();
    res.render("session/logout", {title: logged_out, user: {username: guest}});
  }
}

module.exports = exports = new Session();
