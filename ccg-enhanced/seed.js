"use strict"

var encryption = require('./encryption'),
    sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('development.sqlite3');

/**
 *  @function db.serialize
 *  @memberof database
 *  @description Initializes tables
 */

 module.exports = exports = db.serialize(function() {

   /**********
   users table
   **********/

   //salt from encryption
   var salt = encryption.salt();

   /*//Drop users table if it exists
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

  //  Log contents of the user table to the console
   db.each("SELECT * FROM users", function(err, row){
     if(err) return console.error(err);
     console.log(row);
   });*/

   /********************
   ** EMBRYO RECOVERY **
   *********************/
   /***********
   client table
   ************/
   // Drop client table if exists
   db.run("DROP TABLE IF EXISTS client");

   // Create the client table
   db.run("CREATE TABLE client (id INTEGER PRIMARY KEY AUTOINCREMENT, clientName TEXT, clientAddress TEXT)");

   // Create client test data
   db.run("INSERT INTO client (clientName, clientAddress) values (?,?)",
      'Mushroom Red Angus',
      'Strong City, KS'
   );
   db.run("INSERT INTO client (clientName, clientAddress) values (?,?)",
      'AJ Cabanatuan',
      '808 Street, Manhattan, KS'
   );

   // Log contents of the client table to the console
   db.each("SELECT * FROM client", function(err, row){
      if(err) return console.error(err);
      console.log(row);
    });

   /**********
   donor table
   ***********/
   // Drop donor table if exists
   db.run("DROP TABLE IF EXISTS donor");

   // Create the donor table
   db.run("CREATE TABLE donor (id INTEGER PRIMARY KEY AUTOINCREMENT, donorClientId INTEGER, donorBreed TEXT, donorRegNum INTEGER, donorTag TEXT, donorName TEXT, FOREIGN KEY(donorClientId) REFERENCES client(id))");

   // Create donor test data
   db.run("INSERT INTO donor (donorClientId, donorBreed, donorRegNum, donorTag, donorName) values (?,?,?,?,?)",
      1,
      'AR',
      1546741,
      'Z040',
      'Mushrush Lana'
   );
   db.run("INSERT INTO donor (donorClientId, donorBreed, donorRegNum, donorTag, donorName) values (?,?,?,?,?)",
      2,
      'BR',
      1234567,
      'AC16',
      'What is Beef?'
   );

   // Log contents of the donor table to the console
    db.each("SELECT * FROM donor", function(err, row){
      if(err) return console.error(err);
      console.log(row);
    });

   /*********
   sire table
   **********/
   // Drop sire table if exists
   db.run("DROP TABLE IF EXISTS sire");

   // Create the sire table
   db.run("CREATE TABLE sire (id INTEGER PRIMARY KEY AUTOINCREMENT, sireDonorId INTEGER, sireName TEXT, sireBreed TEXT, sireRegNum INTEGER, sireCode TEXT)");

   // Create sire test data
   db.run("INSERT INTO sire (sireDonorId, sireName, sireBreed, sireRegNum, sireCode) values (?,?,?,?,?)",
      1,
      'Beckton Clifftop Z500',
      'AR',
      1544604,
      '16AR2130'
   );
   db.run("INSERT INTO sire (sireDonorId, sireName, sireBreed, sireRegNum, sireCode) values (?,?,?,?,?)",
      2,
      'Moo Train',
      'AR',
      7654321,
      '17AR2017'
   );

   // Log contents of the sire table to the console
   db.each("SELECT * FROM sire", function(err, row){
      if(err) return console.error(err);
      console.log(row);
    });

   /********************
   embryo_recovery table
   *********************/
   // Drop embryo_recovery table if exists
   db.run("DROP TABLE IF EXISTS embryo_recovery");

   // Create the embryo_recovery table
   db.run("CREATE TABLE embryo_recovery (id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          "embryoDonorId INTEGER, embryoSireId INTEGER, embryoTwoId INTEGER, embryoFreezeDate DATE, " +
          "embryoEstrusOnsetDate DATE, embryoBreedDate DATE, embryoRecoveryDate DATE, embryoNumRecovered INTEGER, " +
          "embryoNumTransferred INTEGER, embryoNumFrozen INTEGER, embryoEtCode TEXT, FOREIGN KEY(embryoDonorId) REFERENCES donor(id), " +
          "FOREIGN KEY(embryoSireId) REFERENCES sire(id), FOREIGN KEY(embryoTwoId) REFERENCES sire(id))");

   // Create embryo_recovery test data
   db.run("INSERT INTO embryo_recovery (embryoDonorId, embryoSireId, embryoTwoId, embryoFreezeDate, " +
          "embryoEstrusOnsetDate, embryoBreedDate, embryoRecoveryDate, embryoNumRecovered, embryoNumTransferred, embryoNumFrozen, embryoEtCode) " +
          "values (?,?,?,?,?,?,?,?,?,?,?)",
      1,
      1,
      null,
      '2015-10-12',
      '2016-06-28',
      '2016-06-28',
      '2016-06-05',
      5,
      5,
      0,
      'E1153'
   );
   db.run("INSERT INTO embryo_recovery (embryoDonorId, embryoSireId, embryoTwoId, embryoFreezeDate, " +
          "embryoEstrusOnsetDate, embryoBreedDate, embryoRecoveryDate, embryoNumRecovered, embryoNumTransferred, embryoNumFrozen, embryoEtCode) " +
          "values (?,?,?,?,?,?,?,?,?,?,?)",
      2,
      2,
      null,
      '2016-01-18',
      '2016-10-17',
      '2016-10-17',
      '2016-05-16',
      9,
      9,
      0,
      'S0117'
    );

    // Log contents of the embryo_transfer table to the console
    db.each("SELECT * FROM embryo_recovery", function(err, row){
       if(err) return console.error(err);
       console.log(row);
     });
 });
