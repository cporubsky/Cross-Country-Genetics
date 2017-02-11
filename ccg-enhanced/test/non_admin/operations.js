var session = require('supertest-session');


class Non_Admin_Operations {
tests() {
  describe('Non-Admin', function() {

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


    //TODO Need to make this expect a 500 error probably (2/9/17)
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

    }
}


module.exports = exports = new Non_Admin_Operations();
