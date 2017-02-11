var session = require('supertest-session');


class Guest_Routes {
tests() {
  describe('Guest Verification', function() {

    var guest;

    //log guest session
    before(function (done) {
      guest = session(require('../../app.js'));
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

      it("should allow guest to access: reset password page [GET](/user/reset)",function(done){
        guest
        .get("/user/reset")
        .expect(200)
        .end(function(err,res){
          res.status.should.equal(200);
          (err === null).should.be.true;
          done();
        });
      }); //end [GET](/user/reset)



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

      it("should not allow guest to access: table of users [GET](/admin/users)",function(done){
        guest
        .get("/admin/users")
        .expect(500)
        .end(function(err,res){
          res.status.should.equal(500);
          (err === null).should.be.true;
          done();
        });
      });//end [GET](/admin/users)

      it("should not allow guest to access: edit their account information [GET](/user/edit/:id)",function(done){
        guest
        .get("/user/edit/1")
        .expect(500)
        .end(function(err,res){
          res.status.should.equal(500);
          (err === null).should.be.true;
          done();
        });
      }); //end [GET](/user/edit/:id)


      //TODO Should probably be a 500 not a 302
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

    }
}


module.exports = exports = new Guest_Routes();
