"use strict"

var company_name = "Cross Country Genetics";

// This middleware requires the current user NOT be a Guest
// Guest status is determined by the username (all guests
// share the username Guest)
function new_user(req, res, next) {
  if(req.user.temp_password && !req.user.is_verified) return next();
  else {
    res.statusCode = 500;
    return res.render('session/login', {title: company_name, message: "You must be signed in to access that page", user: req.user});
  }
}

module.exports = exports = new_user;
