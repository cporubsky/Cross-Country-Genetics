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
    PORT = 8080;

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
    app.get('/reset', session.reset);  //reset user account

    var landing = require('./endpoints/landing');
    app.get('/index', no_guests, landing.index);

    var forms = require('./endpoints/forms');
    app.get('/formAbc', no_guests, forms.abcForm);
    app.get('/firstForm', no_guests, forms.firstForm);
    app.get('/donorCowEnrollment', no_guests, forms.donorCowEnrollment);
    app.get('/caneCodeLog', no_guests, forms.caneCodeLog);
    app.get('/viewForms', no_guests, forms.viewForms);

    /* admin routes accessible only if
    a user account is an admin account */
    var admin = require('./endpoints/admin');
    app.get('/admin', admin_only, admin.index);  //Admin landing page
    app.get('/admin/create', admin_only, admin.createUser); //Create user form
    app.post('/admin/create', admin_only, admin.createUser2); //Create user form
    app.get('/admin/delete/:id(\\d+)', admin_only, admin.deleteUser);
    app.get('/admin/edit/:id(\\d+)', admin_only, admin.edit);
    app.post('/admin/edit/:id(\\d+)', admin_only, admin.commitEdit);
    
    //app.get('/manageusers', admin_only, admin.manageusers);


    //start express app
    app.listen(PORT, () => {
      console.log("Listening on port " + PORT);
    });
