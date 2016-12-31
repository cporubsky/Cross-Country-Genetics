"use strict"

var fs = require('fs');
var path = require('path');

class Template {

  newUserEmail() {

    var file = fs.readFileSync(path.join(__dirname, 'user_invitation.html'), "utf8");
    //console.log(file);
    return file;

  }







  }





module.exports = exports = new Template();
