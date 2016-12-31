"use strict"

const config = require('../config/config.json');
var randomstring = require("randomstring");
var nodemailer = require('nodemailer');
var logger = require('log4js').getLogger(config.logger);
var template = require('../helpers/template');
var moment = require('moment');


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
  sendNewUserMail(tempPass, email) {
    console.log('Temporary password: ' + tempPass);
    console.log('Email to send invite to: ' + email);
    var split = email.split('@');
    var usersplit = split[0];


    //transporter
    var transporter = nodemailer.createTransport({
          service: config.email.transporter.service,
          auth: {
            user: config.email.transporter.user,
            pass: config.email.transporter.pass
          }
        }); //end transporter

    var sendNew = transporter.templateSender({
        subject: 'Welcome, {{name}}!',
        text: '',
        //html: '<a href="{{action_url}}" class="button button--" target="_blank">Set up account</a>'
        html: template.newUserEmail()
        }, {
        from: 'sender@example.com',
    });

    sendNew({
        //replace with email passed in
        to: 'ccgtestkansas@gmail.com'
    }, {
        //username: 'Node Mailer',
        //password: '!"\'<>&some-thing'
        name: usersplit, //split email at the '@' symbol and just use the first part
        invite_sender_name: 'Joel Anderson',
        invite_sender_organization_name: 'Cross Country Genetics',
        action_url: 'http://localhost:8080/user/verfiy/' + tempPass,
        support_email: 'joel_email@ccg.com',
        help_url: 'helpurl.com'

    }, function(err, info){
        if(err){
           console.log('Error');
        }else{
            console.log('New user email sent');
        }
    });


  } //end send email


  sendResetMail(tempPass, email) {
    console.log('Temporary password: ' + tempPass);
    console.log('Email to send invite to: ' + email);
    var split = email.split('@');
    var usersplit = split[0];


    //transporter
    var transporter = nodemailer.createTransport({
          service: config.email.transporter.service,
          auth: {
            user: config.email.transporter.user,
            pass: config.email.transporter.pass
          }
        }); //end transporter

    var sendReset = transporter.templateSender({
        subject: 'Password Reset Request',
        text: '',
        //html: '<b>Hello, <strong>{{username}}</strong>, Your password is:\n<b>{{ password }}</b></p>'
        html: template.resetPasswordEmail()
        }, {
        from: 'sender@example.com',
    });

    sendReset({
        //replace with email passed in
        to: 'ccgtestkansas@gmail.com'
    }, {
        //username: 'Node Mailer',
        //password: '!"\'<>&some-thing'
        name: usersplit, //split email at the '@' symbol and just use the first part
        operating_system: 'Some OS',
        browser_name: 'Some Brower (ex. Chrome)',
        action_url: 'http://localhost:8080/user/verify/' + tempPass,
        //support_email: 'joel_email@ccg.com',
        support_url: 'http://helpurl.com'

    }, function(err, info){
        if(err){
           console.log('Error');
        }else{
            console.log('New user email sent');
        }
    });


  } //end send email



  getTimestamp() {
    return moment().format("MM-DD-YYYY HH:mm");

  }



}
module.exports = exports = new Helper();
