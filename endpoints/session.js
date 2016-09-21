"use strict"

var encryption = require('../encryption'),
    db = require('../db'),
    formidable = require('formidable'),
    company_name = "Cross Country Genetics";

class Session {

  //for now it redirects to login page
  redirect(req, res) {
      res.writeHead(301, {"Content-Type":"text/html", "Location":"/login"});
          res.end("This page has moved to <a href='/login'>login</a>");
    }

  // Renders a login form with no error message
  login(req, res) {
    res.render('session/login', {title: company_name, message: "", user: req.user});
  }

  // Creates a new session, provided the username and password match one in the database,
  // If not, renders the login form with an error message.
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

        if(err) return res.render('session/login', {title: company_name, message: "Login Failed. Please try again.", user: req.user});
        if(!user) return res.render('session/login', {title: company_name, message: "Login Failed. Please try again.", user: req.user});
        if(user.password_digest != encryption.digest(fields.password + user.salt)) return res.render('session/login', {message: "Username/Password not found.  Please try again.", user: req.user});
        req.session.user_id = user.id;
        return res.redirect('/index');
      });
    });
  }

  // Ends a user session by flushing the session cookie.
  stop(req, res) {
    req.session.reset();
    res.render("session/logout", {title: company_name, user: {username: "Guest"}});
  }
}

module.exports = exports = new Session();
