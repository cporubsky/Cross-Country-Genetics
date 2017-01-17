"use strict"

var encryption = require('./encryption.js'),
    sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('./database/development.sqlite3');



  /**
   *  @function db.serialize
   *  @memberof database
   *  @description Initializes tables
   */

   db.serialize(function() {

      db.run("DROP TABLE IF EXISTS questions");

      db.run("CREATE TABLE questions (" +
        "id INTEGER PRIMARY KEY AUTOINCREMENT," +
        "security_question TEXT)");

        db.run("INSERT INTO questions (" +
          "security_question)" +
          "values" +
          "(?)",
          'What is the last name of the teacher who gave you your first failing grade?'
        );

        db.run("INSERT INTO questions (" +
          "security_question)" +
          "values" +
          "(?)",
          'Which phone number do you remember most from your childhood?'
        );

        db.run("INSERT INTO questions (" +
          "security_question)" +
          "values" +
          "(?)",
          'What street did you grow up on?'
        );

        db.run("INSERT INTO questions (" +
          "security_question)" +
          "values" +
          "(?)",
          'What city did you meet your spouse in?'
        );

        db.run("INSERT INTO questions (" +
          "security_question)" +
          "values" +
          "(?)",
          'What is the name of your first employer?'
        );

        db.each("SELECT * FROM questions", function(err, row){
          if(err) return console.error(err);
          console.log(row);
        });




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
         "verified BOOLEAN," +
         "security_question INTEGER," +
         "security_answer TEXT)");

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
         "verified," +
         "security_question," +
         "security_answer)" +
         "values" +
         "(?,?,?,?,?,?,?,?,?,?,?)",
         'Admin',                              //first name
         'User',                               //last name
         'admin',                              //username
         'admin@none.com',                     //email
         true,                                 //is admin
         encryption.digest('password' + salt), //digest
         salt,                                 //salt
         null,                                 //temp password
         true,
         1,
         'phoenix'
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
         "verified," +
         "security_question," +
         "security_answer)" +
         "values" +
         "(?,?,?,?,?,?,?,?,?,?,?)",
         'Standard',                           //first name
         'User',                               //last name
         'user',                               //username
         'user@none.com',                      //email
         false,                                //not admin
         encryption.digest('password' + salt), //digest
         salt,                                 //salt
         null,                                 //temp password
         true,
         1,
         'manhattan'
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
         "verified," +
         "security_question," +
         "security_answer)" +
         "values" +
         "(?,?,?,?,?,?,?,?,?,?,?)",
         'Another',                            //first name
         'User',                               //last name
         'user2',                              //username
         'user@gmail.com',                     //email
         false,                                //not admin
         null,                                 //digest (NULL)
         salt,                                 //salt
         'DFRxVyumnvPg',                       //temp password
         false,
         0,
         null
       );

      //Log contents of the user table to the console
      db.each("SELECT * FROM users", function(err, row){
        if(err) return console.error(err);
        console.log(row);
      });


      console.log("DB SEED DONE!");


     });
