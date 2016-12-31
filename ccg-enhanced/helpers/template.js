"use strict"

var fs = require('fs');
var path = require('path');

class Template {

  newUserEmail() {
    return fs.readFileSync(path.join(__dirname, '../public/email_templates/user_invitation.html'), "utf8");
  }

  resetPasswordEmail() {
    return fs.readFileSync(path.join(__dirname, '../public/email_templates/password_reset.html'), "utf8");
  }

}





module.exports = exports = new Template();
