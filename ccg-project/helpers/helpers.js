"use strict"

const config = require('../config/config.json');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var logger = require('log4js').getLogger(config.logger);
var template = require('../helpers/template');

/**
 *  This class handles helper functions.
 *  @class
 */
class Helper {

  /**
   *  @function createTransporter
   *  @memberof Helper
   *  @description Creates transporter to send emails.
   *  @returns {Object} Tranporter
   *  @instance
   */
  createTransporter() {
    return nodemailer.createTransport({
      service: config.email.transporter.service,
      auth: {
        user: config.email.transporter.user,
        pass: config.email.transporter.pass
      }
    });
  }

  /**
   *  @function generateTempPassword
   *  @memberof Helper
   *  @description Creates temporary password with random characters.
   *  @returns {string} Random password string
   *  @instance
   */
  generateTempPassword() {
    return randomstring.generate({
      length: 12,
      charset: 'alphanumeric'
    });
  }

  //TODO need to make different messages for html fields
  //Examples: New User, Reset Password, etc.
  /**
   *  @function generateTempPassword
   *  @memberof Helper
   *  @description Creates temporary password with random characters.
   *  @param {string} transporter - Transporter
   *  @param {string} tempPass - Temporary Password
   *  @param {string} email - Email to send message to.
   *  @instance
   */
  sendMail(tempPass, email, purpose) {

    //transporter
    var transporter = nodemailer.createTransport({
          service: config.email.transporter.service,
          auth: {
            user: config.email.transporter.user,
            pass: config.email.transporter.pass
          }
        }); //end transporter



    /*var message;

    switch(purpose)
    {
    case 'new':
      // message = '<p> You were added as a new user for Cross Country Genetics. </p>' +
      // '<p> Follow the link below, and use your temp password to finish the process.  </p>' +
      // '<a href="http://google.com">http://google.com</a>' +
      // '<p>' + tempPass + '</p>'
      message = template.newUserEmail()
      break;
    case 'reset':
      message = '<p> You requested to reset your password for Cross Country Genetics. </p>' +
      '<p> Follow the link below, and use your temp password to finish the process.  </p>' +
      '<a href="http://google.com">http://google.com</a>' +
      '<p>' + tempPass + '</p>'
      break;
    default:
      console.log("In default");
    }


    transporter.sendMail({
      from: 'CCG Admin <crosscountrygeneticskansas@gmail.com>',
      to: email,
      subject: 'Action Required',
      html: message
    }, function(error, info){
      if(error){
        console.log(error);
        return false;
      }
      console.log("Success in sendMail Function");
      return true;
    });*/

    var sendNew = transporter.templateSender({
        subject: 'Password reminder for {{username}}!',
        text: '',
        html: '<b>Hello, <strong>{{username}}</strong>, Your password is:\n<b>{{ password }}</b></p>'
        }, {
        from: 'sender@example.com',
    });

    sendNew({
        to: 'ccgtestkansas@gmail.com'
    }, {
        username: 'Node Mailer',
        password: '!"\'<>&some-thing'
    }, function(err, info){
        if(err){
           console.log('Error');
        }else{
            console.log('Password reminder sent');
        }
    });


  }
}
module.exports = exports = new Helper();
