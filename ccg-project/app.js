
const config = require('./config/config.json');
var express = require('express'),
    app = express(),
    sessions = require('client-sessions'),
    log4js = require('log4js'),
    load_user = require('./middleware/load_user'),
    admin_only = require('./middleware/admin_only'),
    no_guests = require('./middleware/no_guests'),
    formidable = require('formidable'),
    bodyParser = require('body-parser'),
    PORT = 8080;

    log4js.configure('./config/log4js.json');
    var logger = log4js.getLogger(config.logger);

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

    var parseBody = bodyParser.urlencoded({ extended: true });

    var session = require('./endpoints/session');
    app.get('/', session.redirect);              //Redirects to '/login'
    app.get('/login', session.login);            //User login form
    app.post('/login', session.start);           //Create session
    app.get('/logout', no_guests, session.stop); //Deletes session

    var landing = require('./endpoints/landing');
    app.get('/index', no_guests, landing.index);

    var forms = require('./endpoints/forms');
    app.get('/formAbc', no_guests, forms.abcForm);                       //Abc Form
    app.post('/formAbc', parseBody, forms.formAbcAjax);                  //Abc Form Ajax
    app.get('/firstForm', no_guests, forms.firstForm);                   //First Form
    app.get('/donorCowEnrollment', no_guests, forms.donorCowEnrollment); //Donor Cow Enrollment
    app.get('/caneCodeLog', no_guests, forms.caneCodeLog);               //Cane Code Log
    app.get('/viewForms', no_guests, forms.viewForms);                   //View Forms

    /* admin routes accessible only if
    a user account is an admin account */
    var admin = require('./endpoints/admin');
    app.get('/admin', admin_only, admin.index);                       //Admin landing page
    app.get('/admin/create', admin_only, admin.createUser);           //Create user form
    app.post('/admin/create', admin_only, admin.commitCreateUser);    //Create user with temp password
    app.get('/admin/delete/:id(\\d+)', admin_only, admin.deleteUser); //Deletes a user
    app.get('/admin/edit/:id(\\d+)', admin_only, admin.edit);         //Edit user form
    app.post('/admin/edit/:id(\\d+)', admin_only, admin.commitEdit);  //Edits a user

    //used to confirm new user
    var user = require('./endpoints/user');
    app.get('/user/confirm', user.confirm);        //Confirm user form
    app.post('/user/confirm', user.commitConfirm); //Confirms a user
    app.get('/user/reset', user.reset);            //Reset password form
    app.post('/user/reset', user.resetPassword);   //Sends email to reset password

    //app.get('/manageusers', admin_only, admin.manageusers);

    //start express app
    app.listen(PORT, () => {
      logger.info("Listening on port " + PORT);
      console.log("Listening on port " + PORT + "\n");
    });

    module.exports = exports = app;
