/**
 * @fileOverview Cross Country Genetics Application
 * @author Corey Porubsky
 * @author AJ Cabanatuan
 * @author Mark Loevenstein
 * @version 1.0
 */



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
    app.get('/', session.redirect);    //redirects to '/login'
    app.get('/login', session.login);  //user login form
    app.post('/login', session.start); //create session
    app.get('/logout', session.stop);  //deletes session

    var landing = require('./endpoints/landing');
    app.get('/index', no_guests, landing.index);

    var forms = require('./endpoints/forms');
    app.get('/formAbc', no_guests, forms.abcForm);
    app.get('/firstForm', no_guests, forms.firstForm);
    app.get('/caneCodeLog', no_guests, forms.caneCodeLog);

    /* admin routes accessible only if
    a user account is an admin account */
    var admin = require('./endpoints/admin');
    app.get('/manageusers', admin_only, admin.index);  //user login form


    //start express app
    app.listen(PORT, () => {
      console.log("Listening on port " + PORT);
    });
