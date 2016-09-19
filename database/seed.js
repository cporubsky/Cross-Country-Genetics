var encryption = require('../encryption'),
    sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('development.sqlite3');

// Create the database schema and populate
db.serialize(function() {

  //salt from encryption
  var salt = encryption.salt();

  /**********
  users table
  **********/

  //Drop users table if it exists
  db.run("DROP TABLE IF EXISTS users");

  //Create the users table
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE, email TEXT UNIQUE, is_admin BOOLEAN, password_digest TEXT, salt TEXT)");

  //Create a default admin
  db.run("INSERT INTO users (username, email, is_admin, password_digest, salt) values (?,?,?,?,?)",
    'admin',                              //create admin
    'admin@none.com',                     //email
    true,                                 //is admin
    encryption.digest('password' + salt), //digest
    salt                                  //salt
  );

  //Create a default user
  db.run("INSERT INTO users (username, email, is_admin, password_digest, salt) values (?,?,?,?,?)",
    'user',                               //create user
    'user@none.com',                      //email
    false,                                //not admin
    encryption.digest('password' + salt), //digest
    salt                                  //salt
  );

  //Log contents of the user table to the console
  db.each("SELECT * FROM users", function(err, row){
    if(err) return console.error(err);
    console.log(row);
  });

});
