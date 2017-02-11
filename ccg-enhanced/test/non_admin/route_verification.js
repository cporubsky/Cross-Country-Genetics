var session = require('supertest-session');


class Non_Admin_Routes {

  tests() {
    //should not allow non-admin to access:
    //should allow non-admin to access:
    describe('Non-Admin Verification', function() {

      var non_admin;

      //log non-admin session
      before(function (done) {
        non_admin = session(require('../../app.js'));
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

        it("should allow non-admin to access: reset password page [GET](/user/reset)",function(done){
          non_admin
          .get("/user/reset")
          .expect(200)
          .end(function(err,res){
            res.status.should.equal(200);
            (err === null).should.be.true;
            done();
          });
        }); //end [GET](/user/reset)

        it("should allow non-admin to access: edit their account information [GET](/user/edit/:id)",function(done){
          non_admin
          .get("/user/edit/2")
          .expect(200)
          .end(function(err,res){
            res.status.should.equal(200);
            (err === null).should.be.true;
            done();
          });
        }); //end [GET](/user/edit/:id)

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

        it("should not allow non-admin to access: table of users [GET](/admin/users)",function(done){
          non_admin
          .get("/admin/users")
          .expect(500)
          .end(function(err,res){
            res.status.should.equal(500);
            (err === null).should.be.true;
            done();
          });
        });//end [GET](/admin/users)


      }); //end non-admin denied

    }); //end non-admin
  }
}

module.exports = exports = new Non_Admin_Routes();
