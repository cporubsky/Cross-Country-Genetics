  var express = require('express'),
    app = express(),
    sessions = require('client-sessions'),
    load_user = require('./middleware/load_user'),
    admin_only = require('./middleware/admin_only'),
    no_guests = require('./middleware/no_guests'),
    PORT = 80;

    app.set('view engine', 'ejs');   //set view to ejs
    app.set('views', './templates'); //set templates directory

    //create sessions cookie
    app.use(sessions({
      cookieName: 'session',
      secret: 'somerandomstring',
      duration: 24*90*60*1000,
      activeDuration: 1000*60*5
    }));

    //load user
    app.use(load_user);

    //set static directory
    app.use(express.static('public'));


    var session = require('./endpoints/session');
    app.get('/login', session.login);      //user login form
    app.post('/login', session.start);  //create session
    app.get('/logout', session.stop); //deletes session

    var start = require('./endpoints/main');
    app.get('/index', start.index);

    //start express app
    app.listen(PORT, () => {
      console.log("Listening on port " + PORT);
    });
