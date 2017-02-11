var session = require('supertest-session');

class Admin_Session {
  tests() {
    describe('Admin Session Verification', function() {

      var admin;

      //log admin session
      before(function (done) {
        admin = session(require('../../app.js'));
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

  }
}

module.exports = exports = new Admin_Session();


// var session = require('supertest-session');
// 
// class Admin_Session {
//   tests() {
//
//   }
// }
//
// module.exports = exports = new Admin_Session();
