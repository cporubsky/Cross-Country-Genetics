var assert = require('assert'),
    session = require('supertest-session');


class Email_Tests {


  tests() {

    describe('Email Tests', function() {

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


      it("should allow admin to: send new user an email [POST](/admin/invite)",function(done){
        admin
        .post("/admin/invite")
        .type('form')
        .send({"invite_email": "bob@bob.com"})
        .expect(302)
        .end(function(err,res){
          (err === null).should.be.true;
          res.status.should.equal(302);
          done();
        });
      }); //end [GET](/admin/delete/:id)





    it("should allow admin to: send new user an email [POST](/user/reset)",function(done){
      admin
      .post("/user/reset")
      .type('form')
      .send({"username": "admin"})
      .expect(302)
      .end(function(err,res){
        (err === null).should.be.true;
        res.status.should.equal(302);
        done();
      });
    }); //end [GET](/admin/delete/:id)
  }); //end admin


  }

}


module.exports = exports = new Email_Tests();
