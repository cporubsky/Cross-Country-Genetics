var session = require('supertest-session');


class Guest_Operations {
tests() {

  describe('Guest', function() {

    var guest;

    //log guest session
    before(function (done) {
      guest = session(require('../../app.js'));
      done();
    });

    

    it("should not allow guest to: delete a user [GET](/admin/delete/:id)",function(done){
      guest
      .get("/admin/delete/4")
      .expect(500)
      .end(function(err,res){
        (err === null).should.be.true;
        res.status.should.equal(500);
        done();
      });
    }); //end [GET](/admin/delete/:id)

    //TODO should probably be a 500 error, not a 302
    it("should not allow guest to: commit edit for a user [POST](/admin/edit/:id)",function(done){
      guest
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

  }); //end guest
    }
}


module.exports = exports = new Guest_Operations();
