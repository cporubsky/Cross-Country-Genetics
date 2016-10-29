var app = require('../app.js'),
    port = 8090,
    express = require('express'),
    app = express(),
    assert = require('assert'),
    supertest = require("supertest"),
    should = require("should"),
    session = require('supertest-session'),
    server = supertest.agent("http://localhost:8080");

    //starts server
    before(function(done) {
      app.listen(port, function(err, result) {
        if(err) done(err);
        else done();
      });
    });

    //kills the app
    after(function(){
      return;
    });

    //entry point tests
    describe('Entry Point Unit Tests', function() {

      it('app should exist', function() {
        assert.ok(app);
      });

      it('should be listening at port ' + port, function(done){
        app.get(server, function(res) {
          assert.equal(res.statusCode, 400);
        });
        done();
      });
    }); //end entry point tests

    //session tests
    describe("Session unit tests",function(){

      it("should redirect to login page [GET](/)",function(done){
        server
        .get("/")
        .expect("Content-type",/json/)
        .expect(301)
        .end(function(err,res){
          res.status.should.equal(301);
          (err === null).should.be.true;
          done();
        });
      });

      it("should direct to login page [GET](/login)",function(done){
        server
        .get("/login")
        .expect("Content-type",/json/)
        .expect(200) // THis is HTTP response
        .end(function(err,res){
          res.status.should.equal(200);
          (err === null).should.be.true;
          done();
        });
      });

      it("should log admin in [POST](/login)",function(done){
        server
        .post("/login")
        .type('form')
        .send({"username": "admin"})
        .send({"password": "password"})
        .type('form')
        .expect(302)
        .end(function(err,res){
          (err === null).should.be.true;
          res.status.should.equal(302);
          done();
        });
      });

      it("should log non-admin in[POST](/login)",function(done){
        server
        .post("/login")
        .type('form')
        .send({"username": "user"})
        .send({"password": "password"})
        .type('form')
        .expect(302)
        .end(function(err,res){
          (err === null).should.be.true;
          res.status.should.equal(302);
          done();
        });
      });

      it("should deny login of non-user [POST](/login)",function(done){
        server
        .post("/login")
        .type('form')
        .send({username: "admin_test"})
        .send({password: "password_test"})
        .type('form')
        .expect(500)
        .end(function(err,res){
          (err === null).should.be.true;
          res.status.should.equal(500);
          done();
        });
      });

      it("should deny login of empty user [POST](/login)",function(done){
        server
        .post("/login")
        .type('form')
        .send({username: ""})
        .send({password: ""})
        .type('form')
        .expect(500)
        .end(function(err,res){
          (err === null).should.be.true;
          res.status.should.equal(500);
          done();
        });
      });

      it("should log user out [GET](/logout)",function(done){
        server
        .get("/logout")
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          (err === null).should.be.true;
          done();
        });
      });

    }); //end session tests

    //landing page tests
    describe('Landing Page Unit Tests', function() {

      it("should send user to landing page [GET](/index)",function(done){
        server
        .get("/index")
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          (err === null).should.be.true;
          done();
        });
      });

    }); //end landing page tests

    //admin tests
    describe('Admin Unit Tests', function() {

      it("should send an admin to admin console [GET](/admin)",function(done){
        server
        .get("/admin")
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          (err === null).should.be.true;
          done();
        });
      });

      it("should send an admin to create user form [GET](/admin/create)",function(done){
        server
        .get("/admin/create")
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          (err === null).should.be.true;
          done();
        });
      });

      it("should send an admin to create user form [POST](/admin/create)",function(done){
        server
        .post("/admin/create")
        .type('form')
        .send({"username": "test_user"})
        .send({"password": "test_password"})
        .type('form')
        .expect(200)
        .end(function(err,res){
          (err === null).should.be.true;
          res.status.should.equal(200);
          done();
        });
      });

      it("should allow an admin to delete a user [GET](/admin/delete/:id)",function(done){
        server
        .get("/admin/delete/2")
        .expect(200)
        .end(function(err,res){
          (err === null).should.be.true;
          res.status.should.equal(200);
          done();
        });
      });

      it("should send an admin to edit user form [GET](/admin/edit/:id)",function(done){
        server
        .get("/admin/edit/2")
        .expect(200)
        .end(function(err,res){
          (err === null).should.be.true;
          res.status.should.equal(200);
          done();
        });
      });

      it("should allow an admin to commit edit for a user [POST](/admin/edit/:id)",function(done){
        server
        .post("/admin/edit/2")
        .type('form')
        .send({"username": "test_user2"})
        .send({"password": "test_password"})
        .type('form')
        .expect(200)
        .end(function(err,res){
          (err === null).should.be.true;
          res.status.should.equal(200);
          done();
        });
      });

    }); //end admin tests
