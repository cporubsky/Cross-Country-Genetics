

var express = require('express'),
    app = express(),
    sessions = require('client-sessions'),
    log4js = require('log4js'),
    load_user = require('./middleware/load_user'),
    admin_only = require('./middleware/admin_only'),
    no_guests = require('./middleware/no_guests'),
    PORT = 8080;

    log4js.configure('./config/log4js.json');
    var log = log4js.getLogger("info");

    //app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));

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

    //set api static directory, route, and only users allowed
    app.use('/api', no_guests, express.static('out'));

    var api = require('./endpoints/api');
    app.get('/api', api.index); //api index

    var session = require('./endpoints/session');
    app.get('/', session.redirect);    //redirects to '/login'
    app.get('/login', session.login);  //user login form
    app.post('/login', session.start); //create session
    app.get('/logout', no_guests, session.stop);  //deletes session


    var landing = require('./endpoints/landing');
    app.get('/index', no_guests, landing.index);

    var forms = require('./endpoints/forms');
    app.get('/formAbc', no_guests, forms.abcForm);
    app.post('/formAbc', forms.formAbcAjax);
    app.get('/firstForm', no_guests, forms.firstForm);
    app.get('/donorCowEnrollment', no_guests, forms.donorCowEnrollment);
    app.get('/caneCodeLog', no_guests, forms.caneCodeLog);
    app.get('/viewForms', no_guests, forms.viewForms);

    /* admin routes accessible only if
    a user account is an admin account */
    var admin = require('./endpoints/admin');
    app.get('/admin', admin_only, admin.index);  //Admin landing page
    app.get('/admin/create', admin_only, admin.createUser); //Create user form
    app.post('/admin/create', admin_only, admin.commitCreateUser); //Create user with temp password
    app.get('/admin/delete/:id(\\d+)', admin_only, admin.deleteUser);
    app.get('/admin/edit/:id(\\d+)', admin_only, admin.edit);
    app.post('/admin/edit/:id(\\d+)', admin_only, admin.commitEdit);

    //used to confirm new user
    var user = require('./endpoints/user');
    app.get('/user/confirm', user.confirm);
    app.post('/user/confirm', user.commitConfirm);
    app.get('/user/reset', user.reset);  //send to page to reset password
    app.post('/user/reset', user.resetPassword); //send message to reset password

    //app.get('/manageusers', admin_only, admin.manageusers);

    //start express app
    app.listen(PORT, () => {
      log.info("Listening on port " + PORT);
      console.log("Listening on port " + PORT + "\n");
    });

    module.exports = exports = app;
