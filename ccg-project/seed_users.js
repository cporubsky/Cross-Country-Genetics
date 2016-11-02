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

       /**********
       users table
       **********/

       //salt from encryption
       var salt = encryption.salt();

       //Drop users table if it exists
       db.run("DROP TABLE IF EXISTS users");

       //Create the users table
       db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, username TEXT UNIQUE, email TEXT UNIQUE, is_admin BOOLEAN, is_approved BOOLEAN, password_digest TEXT, salt TEXT, temp_password TEXT)");

       //Create a default admin
       db.run("INSERT INTO users (name, username, email, is_admin, is_approved, password_digest, salt, temp_password) values (?,?,?,?,?,?,?,?)",
         'Admin user',                         //name
         'admin',                              //username
         'admin@none.com',                     //email
         true,                                 //is admin
         true,                                 //is approved
         encryption.digest('password' + salt), //digest
         salt,                                  //salt
         null
       );

       //Create a default user
       db.run("INSERT INTO users (name, username, email, is_admin, is_approved, password_digest, salt, temp_password) values (?,?,?,?,?,?,?,?)",
         'Standard User',                      //name
         'user',                               //username
         'user@none.com',                      //email
         false,                                //not admin
         true,                                 //is approved
         encryption.digest('password' + salt), //digest
         salt,                                 //salt
         null
       );

       //Create an unapproved std user
       db.run("INSERT INTO users (name, username, email, is_admin, is_approved, password_digest, salt, temp_password) values (?,?,?,?,?,?,?,?)",
         'Another User',                       //name
         'user2',                              //username
         'user_2@none.com',                    //email
         false,                                //not admin
         false,                                //not approved
         encryption.digest('password' + salt), //digest
         salt,                                 //salt
         null
       );

      //Log contents of the user table to the console
      //  db.each("SELECT * FROM users", function(err, row){
      //    if(err) return console.error(err);
      //    console.log(row);
      //  });


      console.log("DB SEED DONE!");


     });
