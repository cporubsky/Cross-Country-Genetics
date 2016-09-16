  var express = require('express'),
    app = express(),
    sessions = require('client-sessions'),
    load_user = require('./middleware/load_user'),
    admin_only = require('./middleware/admin_only'),
    no_guests = require('./middleware/no_guests'),
    PORT = 80;

    var session = require('./endpoints/session');
    app.get('/login', session.login);

    //start express app
    app.listen(PORT, () => {
      console.log("Listening on port " + PORT);
    });
