
const config = require('./config/config.json');
var express = require('express'),
    app = express(),
    sessions = require('client-sessions'),
    log4js = require('log4js'),
    load_user = require('./middleware/load_user'),
    admin_only = require('./middleware/admin_only'),
    no_guests = require('./middleware/no_guests'),
    new_user = require('./middleware/new_user'),
    formidable = require('formidable'),
    bodyParser = require('body-parser'),
    morgan = require('morgan'),
    PORT = 8080;
    var flash = require('req-flash');

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
    app.use(flash());

    //log every request to console
    app.use(morgan('dev'));

    //load user
    app.use(load_user);

    //set static directory
    app.use(express.static('public'));

    // Main middleware
    app.use(function(req, res, next){
      // if there's a flash message in the session request, make it available in the response, then delete it
      res.locals.sessionFlash = req.session.sessionFlash;
      delete req.session.sessionFlash;
      next();
    });

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
    app.post('/index/search', parseBody, landing.search);      // Search Results

    var forms = require('./endpoints/forms');
    app.get('/formAbc', no_guests, forms.abcForm);                       //Abc Form
    app.post('/formAbc', parseBody, forms.formAbcAjax);                  //Abc Form Ajax
    app.get('/firstForm', no_guests, forms.firstForm);                   //First Form
    app.get('/individualDonorFile', no_guests, forms.individualDonorFile); //Donor Cow Enrollment
    app.post('/individualDonorFile', parseBody, forms.individualDonorFile);
    app.get('/individualDonorFile/edit/:tag/:client', no_guests, forms.editForm);
    app.get('/caneCodeLog', no_guests, forms.caneCodeLog);               //Cane Code Log
    app.get('/viewForms', no_guests, forms.viewForms);                   //View Forms


    /* admin routes accessible only if
    a user account is an admin account */
    var admin = require('./endpoints/admin');

    //COMPLETE (At least works.)
    app.get('/admin', admin_only, admin.index);
    app.get('/admin/users', admin_only, admin.viewUsers);
    app.post('/admin/invite', admin_only, admin.inviteUser);

    //Tested
    app.post('/admin/edit/:id(\\d+)', admin_only, admin.commitEdit);
    app.get('/admin/delete/:id(\\d+)', admin_only, admin.deleteUser);

    //used to confirm new user
    var user = require('./endpoints/user');

    //COMPLETE (At least works.)
    app.get('/user/reset', user.reset);
    app.post('/user/reset', user.resetEmail);

    app.get('/user/verify/:token', user.verifyToken);
    app.post('/user/reset/:token', user.resetCommit); //working on 12/31/16
    app.get('/user/edit/:id(\\d+)', no_guests, user.edit);
    app.post('/user/edit/:id(\\d+)', user.commitEdit);

    //NOT COMPLETE YET
    app.post('/user/new/:token', user.commitNewUser);

    //handles invalid urls
    app.all('*', function(req, res) {
      res.redirect("/index");
    });

    //start express app
    app.listen(PORT, () => {
      logger.info("Listening on port " + PORT);
      console.log("Listening on port " + PORT + "\n");
    });

    module.exports = exports = app;
