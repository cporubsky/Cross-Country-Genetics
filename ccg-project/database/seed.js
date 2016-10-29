"use strict"

var encryption = require('../encryption'),
    sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('development.sqlite3');



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
      db.each("SELECT * FROM users", function(err, row){
        if(err) return console.error(err);
        console.log(row);
      });


      /**************
      cane_log table
      **************/
      db.run("DROP TABLE IF EXISTS cane_log");

      db.run("CREATE TABLE cane_log (id INTEGER PRIMARY KEY AUTOINCREMENT, tag_id TEXT NOT NULL, loc TEXT, freeze_date DATE, client TEXT, donor TEXT, sire TEXT, g1 INTEGER, g2 INTEGER, g3 INTEGER, total INTEGER, age TEXT)");

      // Test row, all values
      // db.run("INSERT INTO cane_log (tag_id, loc, freeze_date, client, donor, sire, g1, g2, g3, total, age) values (?,?,?,?,?,?,?,?,?,?,?)",
      //   '888888',       // tag_id
      //   '1-1',        // loc
      //   '1/1/11',     // freeze_date
      //   'Client Guy', // client
      //   'Donor Guy',  // donor
      //   'Sire Guy',   // sire
      //   1,            // g1
      //   1,            // g2
      //   1,            // g3
      //   3,            // total
      //   '7.0d.'       // age
      // );

      // Test row, null values
      // db.run("INSERT INTO cane_log (tag_id, loc, freeze_date, client, donor, sire, g1, g2, g3, total, age) values (?,?,?,?,?,?,?,?,?,?,?)",
      //   999999, // tag_id
      //   null,   // loc
      //   null,   // freeze_date
      //   null,   // client
      //   null,   // donor
      //   null,   // sire
      //   null,   // g1
      //   null,   // g2
      //   null,   // g3
      //   null,   // total
      //   null    // age
      // );

      db.each("SELECT count(*) FROM cane_log", function(err, row){
        if(err) return console.error(err);
        console.log(row);
      });

    });
