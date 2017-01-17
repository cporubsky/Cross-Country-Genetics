"use strict"

var encryption = require('./encryption.js'),
    sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('./database/development.sqlite3'),
    query = require('./database/query');

    var helper = require('./helpers/helpers');




  /**
   *  @function db.serialize
   *  @memberof database
   *  @description Initializes tables
   */

   db.serialize(function() {


       /**********
       users table
       **********/

       //salt from encryption
       var salt = encryption.salt();

       //Drop users table if it exists
       db.run("DROP TABLE IF EXISTS users");


       //Create the users table
       db.run("CREATE TABLE users (" +
         "id INTEGER PRIMARY KEY AUTOINCREMENT," +
         "first_name TEXT," +
         "last_name TEXT," +
         "username TEXT UNIQUE," +
         "email TEXT UNIQUE," +
         "is_admin BOOLEAN," +
         "password_digest TEXT,"+
         "salt TEXT," +
         "temp_password TEXT," +
         "tempPassCreatedOn Text," +
         "is_verified BOOLEAN," +
         "secretHash TEXT," +
         "createdBy TEXT," +
         "createdOn TEXT)");

       //Create a default admin
       db.run("INSERT INTO users (" +
         "first_name," +
         "last_name, "+
         "username," +
         "email," +
         "is_admin," +
         "password_digest," +
         "salt," +
         "temp_password," +
         "tempPassCreatedOn," +
         "is_verified," +
         "secretHash," +
         "createdBy," +
         "createdOn)" +
         "values" +
         "(?,?,?,?,?,?,?,?,?,?,?,?,?)",
         'Admin',                              //first name
         'User',                               //last name
         'admin',                              //username
         'admin@none.com',                     //email
         true,                                 //is admin
         encryption.digest('password' + salt), //digest
         salt,                                 //salt
         null,                                 //temp password
         null,
         true,
         encryption.digest('secret' + salt),
         'SEED PROGRAM',
         helper.getTimestamp()
       );

       //Create a default user
       db.run("INSERT INTO users (" +
         "first_name," +
         "last_name, "+
         "username," +
         "email," +
         "is_admin," +
         "password_digest," +
         "salt," +
         "temp_password," +
         "tempPassCreatedOn," +
         "is_verified," +
         "secretHash," +
         "createdBy," +
         "createdOn)" +
         "values" +
         "(?,?,?,?,?,?,?,?,?,?,?,?,?)",
         'Standard',                           //first name
         'User',                               //last name
         'user',                               //username
         'user@none.com',                      //email
         false,                                //not admin
         encryption.digest('password' + salt), //digest
         salt,                                 //salt
         null,                                 //temp password
         null,
         true,
         encryption.digest('secret' + salt),
         'SEED PROGRAM',
         helper.getTimestamp()
       );

       //Create an unapproved std user
       db.run("INSERT INTO users (" +
         "first_name," +
         "last_name, "+
         "username," +
         "email," +
         "is_admin," +
         "password_digest," +
         "salt," +
         "temp_password," +
         "tempPassCreatedOn," +
         "is_verified," +
         "secretHash," +
         "createdBy," +
         "createdOn)" +
         "values" +
         "(?,?,?,?,?,?,?,?,?,?,?,?,?)",
         'Another',                            //first name
         'User',                               //last name
         'user2',                              //username
         'user@gmail.com',                     //email
         false,                                //not admin
         null,                                 //digest (NULL)
         salt,                                 //salt
         'DFRxVyumnvPg',                       //temp password
         helper.getTimestamp(),
         false,
         encryption.digest('secret' + salt),
         'SEED PROGRAM',
         helper.getTimestamp()
       );

      //Log contents of the user table to the console
      db.each("SELECT * FROM users", function(err, row){
        if(err) return console.error(err);
        console.log(row);
      });



      /*
      <Logins>
      ID
      Username
      PasswordHash
      TempPasswordHash
      SecretPinHash
      Salt
      Is_Verified
      Is_Admin
      */
      /*
      <Users>
      ID
      FirstName
      LastName
      Username
      CreatedBy
      CreatedOnDate
      */

      // db.run("DROP TABLE IF EXISTS logins");
      // db.run("DROP TABLE IF EXISTS users");
      //
      // var salt = encryption.salt();
      //
      // db.run("CREATE TABLE logins (" +
      //   "Id INTEGER PRIMARY KEY AUTOINCREMENT," +
      //   "Username TEXT UNIQUE," +
      //   "PasswordHash TEXT," +
      //   "TempPasswordHash TEXT ," +
      //   "SecretHash TEXT," +
      //   "Salt TEXT," +
      //   "Is_Verified BOOLEAN,"+
      //   "Is_Admin BOOLEAN)");
      //
      //   db.run("CREATE TABLE users (" +
      //     "Id INTEGER UNIQUE," +
      //     "FirstName TEXT UNIQUE," +
      //     "LastName TEXT," +
      //     "Username TEXT UNIQUE," +
      //     "Email TEXT, " +
      //     "CreatedOnDate TEXT," +
      //     "CreatedBy TEXT)");
      //
      //     db.run("INSERT INTO logins (" +
      //       "Username," +
      //       "PasswordHash, "+
      //       "TempPasswordHash," +
      //       "SecretHash," +
      //       "Salt," +
      //       "Is_Verified," +
      //       "Is_Admin)" +
      //       "values" +
      //       "(?,?,?,?,?,?,?)",
      //       'admin',                              //Username
      //       encryption.digest('password' + salt), //PasswordHash
      //       encryption.digest('temp' + salt),     //TempPasswordHash
      //       encryption.digest('1234' + salt),     //SecretHash
      //       salt,                                 //Salt
      //       true,                                 //Is Verified
      //       true                                  //Is Admin
      //     );
      //
      //     db.run("INSERT INTO logins (" +
      //       "Username," +
      //       "PasswordHash, "+
      //       "TempPasswordHash," +
      //       "SecretHash," +
      //       "Salt," +
      //       "Is_Verified," +
      //       "Is_Admin)" +
      //       "values" +
      //       "(?,?,?,?,?,?,?)",
      //       'user',                               //Username
      //       encryption.digest('password' + salt), //PasswordHash
      //       encryption.digest('temp' + salt),     //TempPasswordHash
      //       encryption.digest('1234' + salt),     //SecretHash
      //       salt,                                 //Salt
      //       true,                                 //Is Verified
      //       false                                  //Is Admin
      //     );
      //
      //     db.run("INSERT INTO logins (" +
      //       "Username," +
      //       "PasswordHash, "+
      //       "TempPasswordHash," +
      //       "SecretHash," +
      //       "Salt," +
      //       "Is_Verified," +
      //       "Is_Admin)" +
      //       "values" +
      //       "(?,?,?,?,?,?,?)",
      //       'user2',                              //Username
      //       encryption.digest('password' + salt), //PasswordHash
      //       encryption.digest('temp' + salt),     //TempPasswordHash
      //       encryption.digest('1234' + salt),     //SecretHash
      //       salt,                                 //Salt
      //       false,                                 //Is Verified
      //       false                                  //Is Admin
      //     );
      //
      //     var id;
      //     //insert into users table
      //     db.get(query.selectAll('logins', 'username'), 'admin', (err, rows) => {
      //         if(rows != null) {
      //           id = rows.Id;
      //           console.log(id);
      //
      //           db.run('INSERT INTO users (' +
      //           "Id," +
      //           "FirstName," +
      //           "LastName," +
      //           "Username," +
      //           "Email, " +
      //           "CreatedOnDate," +
      //           "CreatedBy)" +
      //           "values" +
      //           "(?,?,?,?,?,?,?)",
      //           1,
      //           'AdminFirst',
      //           'AdminLast',
      //           'admin',
      //           'adminemail@email.com',
      //           'DATE',
      //           'SYSTEM');
      //
      //       }
      //
      //
      //       // //if we get here, user exists, insert user
      //       // db.run(query.insert('users', 'Id, FirstName, LastName, Username, Email, CreatedOnDate, CreatedBy'),
      //       //   id,
      //       //   'AdminFirst',
      //       //   'AdminLast',
      //       //   'admin',
      //       //   'adminemail@email.com',
      //       //   //new Date().toLocaleString(),
      //       //   'Date',
      //       //   'System',
      //       //   (err, entry) => {
      //       //     if(err) {
      //       //       //TODO set res status
      //       //       //find specific error for logger
      //       //       logger.error("Some error 1");
      //       //
      //       //
      //       //   } //end err
      //       //
      //       //   console.log("should have worked")
      //       // }); //end insert
      //
      //
      //
      //
      //
      //
      //     }); //end check



          // db.each("SELECT * FROM users", function(err, rows){
          //   if(err) return console.error(err);
          //   console.log(rows);
          // });

      console.log("DB SEED DONE!");


     });
