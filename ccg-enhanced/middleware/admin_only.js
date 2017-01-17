"use strict"

var company_name = "Cross Country Genetics";

// Only users with admin status can continue
// down the pipeline
function adminOnly(req, res, next) {
  if(req.user && req.user.is_admin) return next();
  else {
    res.statusCode = 500;
    res.render('session/login', {title: company_name, message: "You must be an admin to access that page", user: req.user});
  }
}

module.exports = exports = adminOnly;
