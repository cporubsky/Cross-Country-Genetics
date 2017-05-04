"use strict"

var encryption = require('./encryption.js'),
    sqlite3 = require('sqlite3'),
    db = new sqlite3.Database('./database/development.sqlite3');

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
  //  var salt = encryption.salt();
  //
  //  //Drop users table if it exists
  //  db.run("DROP TABLE IF EXISTS users");
  //
  //  //Create the users table
  //  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, username TEXT UNIQUE, email TEXT UNIQUE, is_admin BOOLEAN, is_approved BOOLEAN, password_digest TEXT, salt TEXT, temp_password TEXT)");
  //
  //  //Create a default admin
  //  db.run("INSERT INTO users (name, username, email, is_admin, is_approved, password_digest, salt, temp_password) values (?,?,?,?,?,?,?,?)",
  //    'Admin user',                         //name
  //    'admin',                              //username
  //    'admin@none.com',                     //email
  //    true,                                 //is admin
  //    true,                                 //is approved
  //    encryption.digest('password' + salt), //digest
  //    salt,                                  //salt
  //    null
  //  );
  //
  //  //Create a default user
  //  db.run("INSERT INTO users (name, username, email, is_admin, is_approved, password_digest, salt, temp_password) values (?,?,?,?,?,?,?,?)",
  //    'Standard User',                      //name
  //    'user',                               //username
  //    'user@none.com',                      //email
  //    false,                                //not admin
  //    true,                                 //is approved
  //    encryption.digest('password' + salt), //digest
  //    salt,                                 //salt
  //    null
  //  );
  //
  //  //Create an unapproved std user
  //  db.run("INSERT INTO users (name, username, email, is_admin, is_approved, password_digest, salt, temp_password) values (?,?,?,?,?,?,?,?)",
  //    'Another User',                       //name
  //    'user2',                              //username
  //    'user_2@none.com',                    //email
  //    false,                                //not admin
  //    false,                                //not approved
  //    encryption.digest('password' + salt), //digest
  //    salt,                                 //salt
  //    null
  //  );
  //
  // //  Log contents of the user table to the console
  //  db.each("SELECT * FROM users", function(err, row){
  //    if(err) return console.error(err);
  //    console.log(row);
  //  });

   /********************
   ** EMBRYO RECOVERY **
   *********************/
   /***********
   client table
   ************/
   // Drop client table if exists
   db.run("DROP TABLE IF EXISTS client");

   // Create the client table
   db.run("CREATE TABLE client (id INTEGER PRIMARY KEY AUTOINCREMENT, clientName TEXT, clientAddress TEXT, clientPhone TEXT)");

   // Create client test data
   db.run("INSERT INTO client (clientName, clientAddress, clientPhone) values (?,?,?)",
      'Mushroom Red Angus',
      'Strong City, KS',
      '7878787878'
   );
   db.run("INSERT INTO client (clientName, clientAddress, clientPhone) values (?,?,?)",
      'AJ Cabanatuan',
      '808 Street, Manhattan, KS',
      '8673262927'
   );

   db.run("INSERT INTO client (clientName, clientAddress, clientPhone) values (?,?,?)",
      'The Bean',
      '123 Street, Manhattan, KS',
      '1231230000'
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
    db.run("CREATE TABLE donor (id INTEGER PRIMARY KEY AUTOINCREMENT, donorClientId INTEGER, donorBreed TEXT, donorRegNum INTEGER, donorTag TEXT, donorName TEXT, " +
       "donorLocation TEXT, donorArrival TEXT, donorDeparture TEXT, donorCalfSex TEXT, donorCalfDOB TEXT, donorDOB TEXT, donorRE TEXT, donorMT TEXT, donorLE TEXT, donorMT2 TEXT, donorBrand TEXT, " +
       "FOREIGN KEY(donorClientId) REFERENCES client(id))");

    // Create donor test data
    db.run("INSERT INTO donor (donorClientId, donorBreed, donorRegNum, donorTag, donorName, donorLocation, donorArrival, donorDeparture, " +
    "donorCalfSex, donorCalfDOB, donorDOB, donorRE, donorMT, donorLE, donorMT2, donorBrand) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
       1,
       'AR',
       1546741,
       'Z040',
       'Mushrush Lana',
       'Manhattan',
       '12/24/16',
       '12/24/16',
       'Male',
       '3/10/17',
       '12/01/16',
       'sdfsdf',
       'sfsfsf',
       'erwrwra',
       'sfsfsf',
       'Branded'
    );
    db.run("INSERT INTO donor (donorClientId, donorBreed, donorRegNum, donorTag, donorName, donorLocation, donorArrival, donorDeparture, " +
    "donorCalfSex, donorCalfDOB, donorDOB, donorRE, donorMT, donorLE, donorMT2, donorBrand) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
       2,
       'BR',
       1234567,
       'AC16',
       'What is Beef?',
       'Topeka',
       '12/22/16',
       '12/22/16',
       'Female',
       '2/24/17',
       '12/07/16',
       'sdfsdf',
       'sfsfsf',
       'erwrwra',
       'sfsfsf',
       'Branded'
    );

    db.run("INSERT INTO donor (donorClientId, donorBreed, donorRegNum, donorTag, donorName, donorLocation, donorArrival, donorDeparture, " +
    "donorCalfSex, donorCalfDOB, donorDOB, donorRE, donorMT, donorLE, donorMT2, donorBrand) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
       3,
       'BR',
       1234567,
       'AC16',
       'What is Beef?',
       'Topeka',
       '12/22/16',
       '12/22/16',
       'Female',
       '2/24/17',
       '12/07/16',
       'sdfsdf',
       'sfsfsf',
       'erwrwra',
       'sfsfsf',
       'Branded'
    );

    db.run("INSERT INTO donor (donorClientId, donorBreed, donorRegNum, donorTag, donorName, donorLocation, donorArrival, donorDeparture, " +
    "donorCalfSex, donorCalfDOB, donorDOB, donorRE, donorMT, donorLE, donorMT2, donorBrand) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
       2,
       'CR',
       7654321,
       'S117',
       'Master Beef',
       'Reach',
       '12/22/16',
       '12/22/16',
       'Female',
       '2/24/17',
       '12/07/16',
       'sdfsdf',
       'sfsfsf',
       'erwrwra',
       'sfsfsf',
       'Branded'
    );

    // Log contents of the donor table to the console
     db.each("SELECT * FROM donor", function(err, row){
       if(err) return console.error(err);
       console.log(row);
     });

    /**********
    bullSelection table
    ***********/
    // Drop bullSelection table if exists
    db.run("DROP TABLE IF EXISTS bullSelection");

    // Create the bullSelection table
    db.run("CREATE TABLE bullSelection (id INTEGER PRIMARY KEY AUTOINCREMENT, bullSelectionDonorTag TEXT, bullSelectionCollectionNum TEXT, bullSelectionEmbryoDisposition TEXT, FOREIGN KEY(bullSelectionDonorTag) REFERENCES donor(donorTag))");

    // Create bullSelection test data
    db.run("INSERT INTO bullSelection (bullSelectionDonorTag, bullSelectionCollectionNum, bullSelectionEmbryoDisposition) values (?,?,?)",
      'Z040',
      'Power Eye',
      'Bad disposition'
    );
    db.run("INSERT INTO bullSelection (bullSelectionDonorTag, bullSelectionCollectionNum, bullSelectionEmbryoDisposition) values (?,?,?)",
      'AC16',
      'Broker',
      'Good disposition'
    );

    // Log contents of the bullSelection table to the console
    db.each("SELECT * FROM bullSelection", function(err, row){
      if(err) return console.error(err);
      console.log(row);
    });

    /**********
    treatment table
    ***********/
    // Drop treatment table if exists
    db.run("DROP TABLE IF EXISTS treatment");

    // Create the treatment table
    db.run("CREATE TABLE treatment (id INTEGER PRIMARY KEY AUTOINCREMENT, treatmentDonorTag TEXT, teatmentDate TEXT, treatmentRightOvary TEXT, treatmentLeftOvary TEXT, treatmentUT TEXT, treatmentTubbNum INTEGER, treatmentComments TEXT, FOREIGN KEY(treatmentDonorTag) REFERENCES donor(donorTag))");

    // Create treatment test data
    db.run("INSERT INTO treatment (treatmentDonorTag, teatmentDate, treatmentRightOvary, treatmentLeftOvary, treatmentUT, treatmentTubbNum, treatmentComments) values (?,?,?,?,?,?,?)",
       'Z040',
       '11/24/16',
       'Done',
       'Not done',
       'UT Test',
       3,
       'Testing comment'
    );
    db.run("INSERT INTO treatment (treatmentDonorTag, teatmentDate, treatmentRightOvary, treatmentLeftOvary, treatmentUT, treatmentTubbNum, treatmentComments) values (?,?,?,?,?,?,?)",
      'AC16',
      '11/27/16',
      'Done',
      'Not done',
      'UT Test',
      7,
      'Testing comment'
    );

    // Log contents of the treatment table to the console
     db.each("SELECT * FROM treatment", function(err, row){
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
          "embryoEstrusOnsetDate DATE, embryoBreedDate DATE, embryoCollectionNum INTEGER, embryoRecoveryDate DATE, embryoNumRecovered INTEGER, " +
          "embryoNumTransferred INTEGER, embryoNumFrozen INTEGER, embryoNumDegen INTEGER, embryoNumUnfertil INTEGER, embryoSireName TEXT, embryoNumPreg INTEGER, embryoEtCode TEXT, FOREIGN KEY(embryoDonorId) REFERENCES donor(id), " +
          "FOREIGN KEY(embryoSireId) REFERENCES sire(id), FOREIGN KEY(embryoTwoId) REFERENCES sire(id))");

   // Create embryo_recovery test data
   db.run("INSERT INTO embryo_recovery (embryoDonorId, embryoSireId, embryoTwoId, embryoFreezeDate, " +
          "embryoEstrusOnsetDate, embryoBreedDate, embryoCollectionNum, embryoRecoveryDate, embryoNumRecovered, embryoNumTransferred, embryoNumFrozen, embryoNumDegen, embryoNumUnfertil, embryoEtCode, embryoSireName, embryoNumPreg) " +
          "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      1,
      1,
      null,
      null,
      '2016-06-28',
      '2016-06-28',
      1,
      '2016-06-05',
      5,
      5,
      0,
      1,
      1,
      'Cow Test',
      2,
      'E1153'
   );
   db.run("INSERT INTO embryo_recovery (embryoDonorId, embryoSireId, embryoTwoId, embryoFreezeDate, " +
          "embryoEstrusOnsetDate, embryoBreedDate, embryoCollectionNum, embryoRecoveryDate, embryoNumRecovered, embryoNumTransferred, embryoNumFrozen, embryoNumDegen, embryoNumUnfertil, embryoEtCode, embryoSireName, embryoNumPreg) " +
          "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      2,
      2,
      null,
      '2016-01-18',
      '2016-10-17',
      '2016-10-17',
      2,
      '2016-05-16',
      9,
      9,
      0,
      0,
      0,
      'Cow Test2',
      3,
      'S0117'
    );
    db.run("INSERT INTO embryo_recovery (embryoDonorId, embryoSireId, embryoTwoId, embryoFreezeDate, " +
           "embryoEstrusOnsetDate, embryoBreedDate, embryoCollectionNum, embryoRecoveryDate, embryoNumRecovered, embryoNumTransferred, embryoNumFrozen, embryoNumDegen, embryoNumUnfertil, embryoEtCode, embryoSireName, embryoNumPreg) " +
           "values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
       2,
       2,
       null,
       '2017-01-18',
       '2017-10-17',
       '2017-10-17',
       3,
       '2017-05-16',
       8,
       8,
       0,
       1,
       1,
       'Cow Test3',
       1,
       'S0117'
     );

    // Log contents of the embryo_transfer table to the console
    db.each("SELECT * FROM embryo_recovery", function(err, row){
       if(err) return console.error(err);
       console.log(row);
     });

     /********************
     ** A SECTION **
     *********************/

     // Drop aSection table if exists
    //  db.run("DROP TABLE IF EXISTS aSection");

     // Create the aSection table
    //  db.run("CREATE TABLE aSection (id INTEGER PRIMARY KEY AUTOINCREMENT, aSectionDonorId TEXT, aSectionformAbcDate TEXT, aSectionBloodType TEXT, " +
    //    "aSectionEstrusOnset TEXT, aSectionIDCode1 TEXT, aSectionFreezeDate1 TEXT, aSectionBreedingDate TEXT, aSectionServiceSire2 TEXT, aSectionRegNum2 TEXT, aSectionRecoveryDate TEXT, " +
    //    "aSectionIDCode2 TEXT, aSectionFreezeDate2 TEXT, aSectionSignature TEXT, aSectionETCode TEXT)");

     // Log contents of the aSection table to the console
     db.each("SELECT * FROM aSection", function(err, row){
        if(err) return console.error(err);
        console.log(row);
      });

      /********************
      ** B SECTION **
      *********************/

      // Drop bSection table if exists
      // db.run("DROP TABLE IF EXISTS bSection");

      // Create the bSection table
      // db.run("CREATE TABLE bSection (id INTEGER PRIMARY KEY AUTOINCREMENT, bSectionDonorId TEXT, bSectionformAbcDate TEXT, bSectionEmbryoTransferDate TEXT, " +
      //   "bSectionFreezeDate1 TEXT, bSectionStrNumber TEXT, bSectionDaysSinceEstrus TEXT, bSectionFreezeDate2 TEXT, bSectionStrNumber2 TEXT, bSectionCaneCode TEXT, bSectionFreezeDate3 TEXT, " +
      //   "bSectionStrNumber3 TEXT, bSectionSignature TEXT, bSectionETCode TEXT)");

      // Log contents of the bSection table to the console
      db.each("SELECT * FROM bSection", function(err, row){
         if(err) return console.error(err);
         console.log(row);
       });

       /********************
       ** B SECTION ROWS **
       *********************/

       // Drop bSectionRows table if exists
      //  db.run("DROP TABLE IF EXISTS bSectionRows");

       // Create the bSectionRows table
      //  db.run("CREATE TABLE bSectionRows (id INTEGER PRIMARY KEY AUTOINCREMENT, bSectionDonorId TEXT, bSectionformAbcDate TEXT, bSectionNum TEXT, " +
      //    "bSectionEarTag TEXT, bSectionRegNum TEXT, bSectionTattoo TEXT, bSectionSide TEXT, bSectionBreedCode TEXT, bSectionDaysSinceEstrus TEXT, bSectionStageCode TEXT, " +
      //    "bSectionQualityCode TEXT, bSectionEmbryoDivided TEXT, bSectionComments TEXT, bSectionResults TEXT)");

       // Log contents of the bSectionRows table to the console
       db.each("SELECT * FROM bSectionRows", function(err, row){
          if(err) return console.error(err);
          console.log(row);
        });

       /********************
       ** C SECTION **
       *********************/

       // Drop cSection table if exists
      //  db.run("DROP TABLE IF EXISTS cSection");

       // Create the cSection table
      //  db.run("CREATE TABLE cSection (id INTEGER PRIMARY KEY AUTOINCREMENT, cSectionDonorId TEXT, cSectionformAbcDate TEXT, cSectionTypeContainer TEXT, cSectionTimeRecoveryToOnset TEXT, " +
      //    "cSectioncryoprotectant TEXT, cSectionSeedTemp TEXT, cSectionCoolingRate TEXT, cSectionPlungeTemp TEXT, cSectionThawingMethod TEXT, cSectionSignature TEXT, cSectionETCode TEXT, " +
      //    "cSectionStimPGM TEXT, cSectionCollHr TEXT, cSectionCollTech TEXT, cSectionStimStatus TEXT, cSectionComments TEXT, cSectionNumEmbryos TEXT, cSectionnumUFO TEXT, cSectionnumDeg TEXT, " +
      //    "cSectionNumTransferred TEXT, cSectionNumFrozen TEXT, cSectionNumSplit TEXT, cSectionTransHr TEXT, cSectionLoc TEXT, cSectionComments2 TEXT, cSectionGrade1 TEXT, " +
      //    "cSectionGrade2 TEXT, cSectionGrade3 TEXT, cSectionTotal TEXT)");

       // Log contents of the cSection table to the console
       db.each("SELECT * FROM cSection", function(err, row){
          if(err) return console.error(err);
          console.log(row);
        });

        /********************
        ** C SECTION ROWS **
        *********************/

        // Drop cSectionRows table if exists
        // db.run("DROP TABLE IF EXISTS cSectionRows");

        // Create the cSectionRows table
        // db.run("CREATE TABLE cSectionRows (id INTEGER PRIMARY KEY AUTOINCREMENT, cSectionDonorId TEXT, cSectionformAbcDate TEXT, cSectionFreezeCode TEXT, " +
        //   "cSectionCaneNum TEXT, cSectionStrNum TEXT, cSectionNumEmbryos TEXT, cSectionNumWashed TEXT, cSectionStageCode TEXT, cSectionQualityCode TEXT, cSectionZoneIntact TEXT, " +
        //   "cSectionDivided TEXT, cSectionTrypsinRaised TEXT, cSectionTank TEXT, cSectionCanister TEXT, cSectionComments TEXT)");

        // Log contents of the cSectionRows table to the console
        db.each("SELECT * FROM cSectionRows", function(err, row){
           if(err) return console.error(err);
           console.log(row);
         });
 });
