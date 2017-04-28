"use strict"

const config = require('../config/config.json');
var db = require('../db');
var formidable = require('formidable');
var bodyParser = require('body-parser');
var logger = require('log4js').getLogger(config.logger);

/**
 *  This class handles forms.
 *  @class
 */
class Forms {

  /**
   *  @function abcForm
   *  @memberof Forms
   *  @description Sends user to ABC form.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  abcForm(req, res){
	  res.render('forms/formAbc', {user: req.user});
  }

  /**
   *  @function firstForm
   *  @memberof Forms
   *  @description Sends user to First form.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  firstForm(req, res){
	  res.render('forms/firstForm', {user: req.user});
  }

  /**
   *  @function donorCowEnrollment
   *  @memberof Forms
   *  @description Sends user to Donor Cow Enrollment form.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  individualDonorFile(req, res){
	  res.render('forms/individualDonorFile', {user: req.user});
  }

  /**
   *  @function caneCodeLog
   *  @memberof Forms
   *  @description Sends user to Cane Code Log form.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  caneCodeLog(req, res){
	  res.render('forms/caneCodeLog', {user: req.user});
  }

  /**
   *  @function viewForms
   *  @memberof Forms
   *  @description Sends user to view forms.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  viewForms(req, res){
    res.render('forms/viewForms', {user: req.user});
  }

  /**
   *  @function formAbcAjax
   *  @memberof Forms
   *  @description Ajax for ABC form.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  formAbcAjax(req, res){
    console.log(req.body);
    var tag = req.body.tag;
    var owner = req.body.owner;
    console.log(tag);
    console.log(owner);
      db.get("SELECT * FROM client c INNER JOIN donor d ON d.donorClientId=c.id INNER JOIN embryo_recovery e ON e.embryoDonorId=d.id"
      + " INNER JOIN sire s ON s.id=e.embryoSireId AND d.donorTag=? AND c.clientName=?", tag, owner, function(err, rows) {
      //db.get("SELECT * FROM client c INNER JOIN donor d ON d.client_id=c.id INNER JOIN embryo_recovery e ON e.donor_id=d.id"
      //+ " INNER JOIN sire s ON s.id=e.sire_id AND d.tag_tattoo=? AND c.name=?", tag, owner, function(err, rows) {
      if(err) {
        // error handling
        return res.sendStatus(500);
      }
      res.setHeader('content-type', 'text/json');
      res.send(JSON.stringify(rows));
    });
  } //end formAbcAjax

  /**
   *  @function formAbcAjax
   *  @memberof Forms
   *  @description Ajax for ABC form.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  formAbcSubmit(req, res){
    console.log("Here");
    res.render('forms/formAbc');
  }

  individualDonorFile(req, res){
    if (req.method == 'POST') {
      var numTableRows = parseInt(req.body.numTableRows)+1;
      var numTreatmentRows = parseInt(req.body.treatmentRows)+1;
      console.log(numTableRows);
      console.log(numTreatmentRows);
      var collection = "collNum3";
      var idNum = req.body.idNum;
      var owner = req.body.owner;
      // Create donor test data
      if(idNum != "" && owner != ""){

        db.run("INSERT INTO client (clientName, clientAddress, clientPhone) values (?,?,?)",
           req.body.name,
           req.body.address,
           req.body.telephoneNum
        );
        db.get("SELECT id FROM client WHERE clientName=? AND clientAddress=? AND clientPhone=?", req.body.name, req.body.address, req.body.telephoneNum, function (err, row) {
           var clientRowID = row['id'];

          db.run("INSERT INTO donor (donorClientID, donorBreed, donorRegNum, donorTag, donorName, donorLocation, donorArrival, donorDeparture, " +
          "donorCalfSex, donorCalfDOB, donorDOB, donorRE, donorMT, donorLE, donorMT2, donorBrand) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
             clientRowID,
             req.body.breed,
             req.body.regNum,
             idNum,
             owner,
             req.body.location,
             req.body.arrival,
             req.body.departure,
             req.body.calfID,
             req.body.dob1,
             req.body.dob2,
             req.body.re,
             req.body.mt1,
             req.body.le,
             req.body.mt2,
             req.body.brandLoc
          );

          for(var i=0; i<6; i++){
            var collection = "collection" + i;
            var embryoDisp = "embryoDisp" + i;
            if(req.param(collection) != ""){
              db.run("INSERT INTO bullSelection (bullSelectionDonorTag, bullSelectionCollectionNum, bullSelectionEmbryoDisposition) values (?,?,?)",
                idNum,
                req.param(collection),
                req.param(embryoDisp)
              );
            }
          }

          db.get("SELECT id FROM donor WHERE donorTag=?", idNum, function (err, row) {
             var donorID = row['id'];

              for(var i=1; i<numTableRows; i++){
                var collection = "collNum" + i;
                var date = "collDate" + i;
                var numEmbryos = "numEmbryos" + i;
                var numTrans = "numTrans" + i;
                var numFrozen = "numFrozen" + i;
                var numDegen = "numDegen" + i;
                var numUnfertil = "numUnfertil" + i;
                var sire = "sire" + i;
                var numPreg = "numPreg" + i;
                db.run("INSERT INTO embryo_recovery (embryoDonorId, embryoCollectionNum, embryoRecoveryDate, embryoNumRecovered, embryoNumTransferred, embryoNumFrozen, embryoNumDegen, " +
                "embryoNumUnfertil, embryoSireName, embryoNumPreg) " +
                       "values (?,?,?,?,?,?,?,?,?,?)",
                   donorID,
                   req.param(collection),
                   req.param(date),
                   req.param(numEmbryos),
                   req.param(numTrans),
                   req.param(numFrozen),
                   req.param(numDegen),
                   req.param(numUnfertil),
                   req.param(sire),
                   req.param(numPreg)
                );
              }
          });

          for(var i=1; i<numTreatmentRows; i++){
            var date = "date" + i;
            var rightOvary = "rightOvary" + i;
            var leftOvary = "leftOvary" + i;
            var ut = "ut" + i;
            var tubbNum = "tubbNum" + i;
            var comments = "comments" + i;
            db.run("INSERT INTO treatment (treatmentDonorTag, teatmentDate, treatmentRightOvary, treatmentLeftOvary, treatmentUT, treatmentTubbNum, treatmentComments) values (?,?,?,?,?,?,?)",
               idNum,
               req.param(date),
               req.param(rightOvary),
               req.param(leftOvary),
               req.param(ut),
               req.param(tubbNum),
               req.param(comments)
            );
          }
        });

        console.log("Data inserted successfully.");
      }
      else{
        console.log('problem with request: ' + req.message);
      }
    }
    res.render('forms/individualDonorFile', {user: req.user});
  }

  /**
   * @function EditForm
   */
  editForm(req, res) {
    console.log("Editing form");
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      if (err) {
        console.log(err);
        req.end(500);
      }
      console.log(fields);
      var clientName = fields.clientname;
      console.log("client name:", clientName);
      res.render('forms/individualDonorFile', {user: req.user});
    });
  }
}


module.exports = exports = new Forms();
