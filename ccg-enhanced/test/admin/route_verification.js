var session = require('supertest-session');


class Admin_Routes {
tests() {

      describe('Admin Verification', function() {

        var admin;

        //log admin session
        before(function (done) {
          admin = session(require('../../app.js'));

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

          it("should allow admin to access: table of users [GET](/admin/users)",function(done){
            admin
            .get("/admin/users")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          });//end [GET](/admin/users)

          it("should allow admin to access: reset password page [GET](/user/reset)",function(done){
            admin
            .get("/user/reset")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/user/reset)

          it("should allow admin to access: edit their account information [GET](/user/edit/:id)",function(done){
            admin
            .get("/user/edit/1")
            .expect(200)
            .end(function(err,res){
              res.status.should.equal(200);
              (err === null).should.be.true;
              done();
            });
          }); //end [GET](/user/edit/:id)


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
    }
}


module.exports = exports = new Admin_Routes();
