var session = require('supertest-session');


class Admin_Operations {
    tests() {
      describe('Admin', function() {

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
          .send({"name": "first last"})
          .send({"username": "username1"})
          .send({"email": "email@email.com"})
          .send({"role": "Admin"})
          .type('form')
          .expect(302)
          .end(function(err,res){
            (err === null).should.be.true;
            res.status.should.equal(302);
            done();
          });
        }); //end [POST](/admin/edit/:id)

      }); //end admin

    }
}


module.exports = exports = new Admin_Operations();
