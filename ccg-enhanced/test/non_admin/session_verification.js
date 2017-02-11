var session = require('supertest-session');

class Non_Admin_Session {
  tests() {
    describe('Non-Admin Session Verification', function() {

      var non_admin;

      //log non-admin session
      before(function (done) {
        non_admin = session(require('../../app.js'));
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
  }
}

module.exports = exports = new Non_Admin_Session();
