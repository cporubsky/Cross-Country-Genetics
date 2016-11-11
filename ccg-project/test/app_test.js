"use strict"

var express = require('express'),
    app = express(require('../app.js')),
    assert = require('assert'),
    should = require("should"),
    supertest = require("supertest"),
    session = require('supertest-session'),
    PORT = 8080;


    /*================*/
    /******************/
    /*      TODO      */
    /******************/
    /*================*/

    //TEST:
    //

    //FORMATTING:
    //Have access tests
    //Have tests for posting separate from access tests


    //entry point tests
    describe('Entry Point Unit Tests', function() {
      it('app should exist', function() {
        assert.ok(session(require('../app.js')));
      });

      it('should be listening at port ' + PORT, function(done){
        app.get(session(require('../app.js')), function(res) {
          assert.equal(res.statusCode, 400);
        });
        done();
      });
    }); //end entry point tests

    describe('Route Access Verification', function() {
      describe('Admin Verification', function() {

        var admin;

        //log admin session
        before(function (done) {
          admin = session(require('../app.js'));

          admin
          .post("/login")
          .send({"username": "admin","password": "password"})
          .expect(302)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(302);
            done();
          });
        });

        describe('Admin Allowed All', function() {
          it("should allow admin to access: login [GET](/login)",function(done){
            admin
            .get("/login")
            .expect(200)
            .end(function(err,res){
              (err === null).should.be.true;
              res.status.should.equal(200);
              done();
            });
          }); //end [GET](/login)

          it("should allow admin to access: index page [GET](/index)",function(done){
            admin
            .get("/index")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/index)

          it("should allow admin to access: formAbc [GET](/formAbc)",function(done){
            admin
            .get("/formAbc")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/formAbc)

          it("should allow admin to access: firstForm [GET](/firstForm)",function(done){
            admin
            .get("/firstForm")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          });//end [GET](/firstForm)

          it("should allow admin to access: donorCowEnrollment [GET](/donorCowEnrollment)",function(done){
            admin
            .get("/donorCowEnrollment")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/donorCowEnrollment)

          it("should allow admin to access: caneCodeLog [GET](/caneCodeLog)",function(done){
            admin
            .get("/caneCodeLog")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/caneCodeLog)

          it("should allow admin to access: viewForms [GET](/viewForms)",function(done){
            admin
            .get("/viewForms")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/viewForms)

          it("should allow admin to access: admin console [GET](/admin)",function(done){
            admin
            .get("/admin")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          });//end [GET](/admin)

          it("should allow admin to access: create user form [GET](/admin/create)",function(done){
              admin
              .get("/admin/create")
              .expect(200)
              .end(function(err,res){
                res.status.should.equal(200);
                (err === null).should.be.true;
                done();
              });
            }); //end [GET](/admin/create)

          it("should allow admin to access: edit user form [GET](/admin/edit/:id)",function(done){
            admin
            .get("/admin/edit/3")
            .expect(200)
            .end(function(err,res){
              (err === null).should.be.true;
              res.status.should.equal(200);
              done();
            });
          }); //end [GET](/admin/edit/:id)

          it("should allow admin to access: logout [GET](/logout)",function(done){
            admin
            .get("/logout")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/logout)

        }); //end admin allowed

      }); //end admin


      //should not allow non-admin to access:
      //should allow non-admin to access:
      describe('Non-Admin Verification', function() {

        var non_admin;

        //log non-admin session
        before(function (done) {
          non_admin = session(require('../app.js'));
          non_admin
          .post("/login")
          .send({"username": "user","password": "password"})
          .expect(302)
          .end(function(err,res){
            (err === null).should.be.true;

            res.status.should.equal(302);
            done();
          });
        });

        describe('Non-Admin Allowed', function() {
          it("should allow non-admin to access: login [GET](/login)",function(done){
            non_admin
            .get("/login")
            .expect(200)
            .end(function(err,res){
              (err === null).should.be.true;
              res.status.should.equal(200);
              done();
            });
          }); //end [GET](/login)

          it("should allow non-admin to access: index page [GET](/index)",function(done){
            non_admin
            .get("/index")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/index)

          it("should allow non-admin to access: formAbc [GET](/formAbc)",function(done){
            non_admin
            .get("/formAbc")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/formAbc)

          it("should allow non-admin to access: firstForm [GET](/firstForm)",function(done){
            non_admin
            .get("/firstForm")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/firstForm)

          it("should allow non-admin to access: donorCowEnrollment [GET](/donorCowEnrollment)",function(done){
            non_admin
            .get("/donorCowEnrollment")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/donorCowEnrollment)

          it("should allow non-admin to access: caneCodeLog [GET](/caneCodeLog)",function(done){
            non_admin
            .get("/caneCodeLog")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/caneCodeLog)

          it("should allow non-admin to access: viewForms [GET](/viewForms)",function(done){
            non_admin
            .get("/viewForms")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/viewForms)


          it("should allow non-admin to access: logout [GET](/logout)",function(done){
            non_admin
            .get("/logout")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/logout)

        }); //end non-admin allowed

        describe('Non-Admin Denied', function() {
          it("should not allow non-admin to access: admin console [GET](/admin)",function(done){
            non_admin
            .get("/admin")
            .expect(500)
            .end(function(err,res){
              res.status.should.equal(500);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/admin)

          it("should not allow non-admin to access: create user [GET](/admin/create)",function(done){
            non_admin
            .get("/admin/create")
            .expect(500)
            .end(function(err,res){
              res.status.should.equal(500);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/admin/create)

          it("should not allow non-admin to access: edit user [GET](/admin/edit/:id)",function(done){
            non_admin
            .get("/admin/edit/3")
            .expect(500)
            .end(function(err,res){
              (err === null).should.be.true;
              res.status.should.equal(500);
              done();
            });
          }); //end [GET](/admin/edit/:id)

        }); //end non-admin denied

      }); //end non-admin

      describe('Guest Verification', function() {

        var guest;

        //log guest session
        before(function (done) {
          guest = session(require('../app.js'));
          done();
        });

        describe('Guest Allowed', function() {
          it("should allow guest to access: login page [GET](/login)",function(done){
            guest
            .get("/login")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/login)

        }); //end guest allowed

        describe('Guest Denied', function() {
          it("should not allow guest to access: index page [GET](/index)",function(done){
            guest
            .get("/index")
            .expect(500)
            .end(function(err,res){
              res.status.should.equal(500);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/index)

          it("should not allow guest to access: formAbc [GET](/formAbc)",function(done){
            guest
            .get("/formAbc")
            .expect(500)
            .end(function(err,res){
              res.status.should.equal(500);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/formAbc)

          it("should not allow guest to access: firstForm [GET](/firstForm)",function(done){
            guest
            .get("/firstForm")
            .expect(500)
            .end(function(err,res){
              res.status.should.equal(500);
              (err === null).should.be.true;
              done();
            });
          });//end [GET](/firstForm)

          it("should not allow guest to access: donorCowEnrollment [GET](/donorCowEnrollment)",function(done){
            guest
            .get("/donorCowEnrollment")
            .expect(500)
            .end(function(err,res){
              res.status.should.equal(500);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/donorCowEnrollment)

          it("should not allow guest to access: caneCodeLog [GET](/caneCodeLog)",function(done){
            guest
            .get("/caneCodeLog")
            .expect(500)
            .end(function(err,res){
              res.status.should.equal(500);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/caneCodeLog)

          it("should not allow guest to access: viewForms [GET](/viewForms)",function(done){
            guest
            .get("/viewForms")
            .expect(500)
            .end(function(err,res){
              res.status.should.equal(500);
              (err === null).should.be.true;
              done();
            });
          });//end [GET](/viewForms)

          it("should not allow guest to access: admin console [GET](/admin)",function(done){
            guest
            .get("/admin")
            .expect(500)
            .end(function(err,res){
              res.status.should.equal(500);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/admin)

          it("should not allow guest to access: create user [GET](/admin/create)",function(done){
            guest
            .get("/admin/create")
            .expect(500)
            .end(function(err,res){
              res.status.should.equal(500);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/admin/create)

          it("should not allow guest to access: edit user [GET](/admin/edit/:id)",function(done){
            guest
            .get("/admin/edit/3")
            .expect(500)
            .end(function(err,res){
              (err === null).should.be.true;
              res.status.should.equal(500);
              done();
            });
          }); //end [GET](/admin/edit/:id)

          it("should not allow guest to access: logout page [GET](/logout)",function(done){
            guest
            .get("/logout")
            .expect(500)
            .end(function(err,res){
              res.status.should.equal(500);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/logout)

        }); //end guest denied

      }); //end guest

    }); //end route access verification


    describe('Session Verification', function() {
      describe('Admin Session Verification', function() {

        var admin;

        //log admin session
        before(function (done) {
          admin = session(require('../app.js'));
          done();
        });

        it("should log admin in [POST](/login)",function(done){
          admin
          .post("/login")
          .send({"username": "admin","password": "password"})
          .expect(302)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(302);
            done();
          });
        }); //end [POST](/login)

        it("should log admin out [GET](/logout)",function(done){
          admin
          .get("/logout")
          .expect(200)
          .end(function(err,res){
            res.status.should.equal(200);
            (err === null).should.be.true;
            done();
          });
        }); //end [GET](/logout)

      }); //end admin

      describe('Non-Admin Session Verification', function() {

        var non_admin;

        //log non-admin session
        before(function (done) {
          non_admin = session(require('../app.js'));
          done();
        });

        it("should log non_admin in [POST](/login)",function(done){
          non_admin
          .post("/login")
          .send({"username": "user","password": "password"})
          .expect(302)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(302);
            done();
          });
        }); //end [POST](/login)

        it("should log non_admin out [GET](/logout)",function(done){
          non_admin
          .get("/logout")
          .expect(200)
          .end(function(err,res){
            res.status.should.equal(200);
            (err === null).should.be.true;
            done();
          });
        }); //end [GET](/logout)

      }); //end non-admin

      describe('Guest(Empty User) Session Verification', function() {

        var guest;

        //log guest session
        before(function (done) {
          guest = session(require('../app.js'));
          done();
        });

        it("should not log guest in [POST](/login)",function(done){
          guest
          .post("/login")
          .send({"username": "","password": ""})
          .expect(500)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(500);
            done();
          });
        }); //end [POST](/login)

        it("should not log guest out [GET](/logout)",function(done){
          guest
          .get("/logout")
          .expect(500)
          .end(function(err,res){
            res.status.should.equal(500);
            (err === null).should.be.true;
            done();
          });
        }); //end [GET](/logout)

      }); //end guest

    });//end session verification


    describe('Admin Operations Verification', function() {
      describe('Admin', function() {

        var admin;

        //log admin session
        before(function (done) {
          admin = session(require('../app.js'));

          admin
          .post("/login")
          .send({"username": "admin","password": "password"})
          .expect(302)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(302);
            done();
          });
        });

        it("should allow admin to: commit new user [POST](/admin/create)",function(done){
          admin
          .post("/admin/create")
          .type('form')
          .send({"username": "user2"})
          .send({"password": "password1"})
          .type('form')
          .expect(200)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(200);
            done();
          });
        }); //end [POST](/admin/create)

        it("should allow admin to: delete a user [GET](/admin/delete/:id)",function(done){
          admin
          .get("/admin/delete/4")
          .expect(302)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(302);
            done();
          });
        }); //end [GET](/admin/delete/:id)

        it("should allow admin to: commit edit for a user [POST](/admin/edit/:id)",function(done){
          admin
          .post("/admin/edit/3")
          .type('form')
          .send({"username": "user2"})
          .send({"password": "password"})
          .type('form')
          .expect(302)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(302);
            done();
          });
        }); //end [POST](/admin/edit/:id)

      }); //end admin

      describe('Non-Admin', function() {

        var non_admin;

        //log non-admin session
        before(function (done) {
          non_admin = session(require('../app.js'));

          non_admin
          .post("/login")
          .send({"username": "user","password": "password"})
          .expect(302)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(302);
            done();
          });
        });

        it("should not allow non-admin to: commit new user [POST](/admin/create)",function(done){
          non_admin
          .post("/admin/create")
          .type('form')
          .send({"username": "user2"})
          .send({"password": "password1"})
          .type('form')
          .expect(500)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(500);
            done();
          });
        }); //end [POST](/admin/create)

        it("should not allow non-admin to: delete a user [GET](/admin/delete/:id)",function(done){
          non_admin
          .get("/admin/delete/4")
          .expect(500)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(500);
            done();
          });
        }); //end [GET](/admin/delete/:id)

        it("should not allow non-admin to: commit edit for a user [POST](/admin/edit/:id)",function(done){
          non_admin
          .post("/admin/edit/3")
          .type('form')
          .send({"username": "user2"})
          .send({"password": "password"})
          .type('form')
          .expect(500)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(500);
            done();
          });
        }); //end [POST](/admin/edit/:id)

      }); //end non-admin

      describe('Guest', function() {

        var guest;

        //log guest session
        before(function (done) {
          guest = session(require('../app.js'));
          done();
        });

        it("should not allow guest to: commit new user [POST](/admin/create)",function(done){
          guest
          .post("/admin/create")
          .type('form')
          .send({"username": "user2"})
          .send({"password": "password1"})
          .type('form')
          .expect(500)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(500);
            done();
          });
        }); //end [POST](/admin/create)

        it("should not allow guest to: delete a user [GET](/admin/delete/:id)",function(done){
          guest
          .get("/admin/delete/4")
          .expect(500)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(500);
            done();
          });
        }); //end [GET](/admin/delete/:id)

        it("should not allow guest to: commit edit for a user [POST](/admin/edit/:id)",function(done){
          guest
          .post("/admin/edit/3")
          .type('form')
          .send({"username": "user2"})
          .send({"password": "password"})
          .type('form')
          .expect(500)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(500);
            done();
          });
        }); //end [POST](/admin/edit/:id)

      }); //end guest

    }); //end admin operations verification
