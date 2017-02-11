var assert = require('assert'),
    session = require('supertest-session');


class Entry_Tests {


  exists() {
    it('app should exist', function() {
      assert.ok(session(require('../app.js')));
    });
  }

  listens(app, port) {
    it('should be listening at port ' + port, function(done){
      app.get(session(require('../app.js')), function(res) {
        assert.equal(res.statusCode, 400);
      });
      done();
    });
  }

}


module.exports = exports = new Entry_Tests();
