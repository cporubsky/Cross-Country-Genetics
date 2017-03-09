"use strict"

var express = require('express'),
    app = express(require('../app.js')),
    //assert = require('assert'),
    should = require("should"),
    //supertest = require("supertest"),
    //session = require('supertest-session'),
    PORT = 8080;

var entry_point = require('./entry_point_tests.js');

var admin_route = require('./admin/route_verification.js');
var admin_session = require('./admin/session_verification.js');
var admin_operations = require('./admin/operations.js');



var non_admin_route = require('./non_admin/route_verification.js');
var non_admin_session = require('./non_admin/session_verification.js');
var non_admin_operations = require('./non_admin/operations.js');



var guest_route = require('./guest/route_verification.js');
var guest_session = require('./guest/session_verification.js');
var guest_operations = require('./guest/operations.js');

var email_tests = require('./email_tests.js')


    //entry point tests
    describe('Entry Point Unit Tests', function() {
      entry_point.exists();
      entry_point.listens(app, PORT);
    }); //end entry point tests

    describe('Route Access Verification', function() {

      /*
      Admin:
      /login
      /index
      /formAbc
      /firstForm
      /donorCowEnrollment
      /caneCodeLog
      /viewForms
      /admin
      /admin/edit/:id
      /logout

      */
      admin_route.tests();
      non_admin_route.tests();
      guest_route.tests();
    }); //end admin

    describe('Session Verification', function() {
      admin_session.tests();
      non_admin_session.tests();
      guest_session.tests();
    });//end session verification

    describe('Operations Verification', function() {
      admin_operations.tests();
      non_admin_operations.tests();
      guest_operations.tests();
    }); //end admin operations verification

    describe('Email Verification', function() {
      email_tests.tests();
    }); //end email verification
