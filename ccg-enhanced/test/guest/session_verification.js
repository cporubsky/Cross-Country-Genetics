var session = require('supertest-session');

class Guest_Session {
  tests() {
    describe('Guest(Empty User) Session Verification', function() {

      var guest;

      //log guest session
      before(function (done) {
        guest = session(require('../../app.js'));
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
  }
}

module.exports = exports = new Guest_Session();
