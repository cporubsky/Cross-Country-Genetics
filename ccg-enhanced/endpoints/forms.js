"use strict"

const config = require('../config/config.json');
var db = require('../db');
var formidable = require('formidable');
var bodyParser = require('body-parser');
var logger = require('log4js').getLogger(config.logger);
var dateTime = require('node-datetime');

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
   *  @function formAbcSubmit
   *  @memberof Forms
   *  @description Submission handler for Form ABC/Collection Form.
   *  @param {object} Request - Http Request Object
   *  @param {object} Response - Http Response Object
   *  @instance
   */
  formAbcSubmit(req, res){
    console.log(req.body.tableBRows);
    var date = dateTime.create();
    var formatted = date.format("Y-m-d H:M:S");
    console.log(formatted);
    db.run("INSERT INTO aSection (aSectionDonorId, aSectionformAbcDate, aSectionBloodType, aSectionEstrusOnset, aSectionIDCode1, aSectionFreezeDate1, aSectionBreedingDate" +
       ", aSectionServiceSire2, aSectionRegNum2, aSectionRecoveryDate, aSectionIDCode2, aSectionFreezeDate2, aSectionSignature, aSectionETCode) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
       req.body.tag,
       formatted,
       req.body.bloodTyped,
       req.body.estrusOnset,
       req.body.idcode1,
       req.body.freezeDate1B,
       req.body.breedDate,
       req.body.serviceSire2,
       req.body.regNum3,
       req.body.recoveryDate,
       req.body.idCode2,
       req.body.freezeDate2B,
       req.body.signatureA,
       req.body.etCodeA
    );
    db.run("INSERT INTO bSection (bSectionDonorId, bSectionformAbcDate, bSectionEmbryoTransferDate, bSectionFreezeDate1, bSectionStrNumber, bSectionDaysSinceEstrus, bSectionFreezeDate2" +
       ", bSectionStrNumber2, bSectionCaneCode, bSectionFreezeDate3, bSectionStrNumber3, bSectionSignature, bSectionETCode) values (?,?,?,?,?,?,?,?,?,?,?,?,?)",
       req.body.tag,
       formatted,
       req.body.dateEmbryoTransfer,
       req.body.freezeDate1,
       req.body.strAmpNumber1,
       req.body.donorDaysSinceEstrus,
       req.body.freezeDate2,
       req.body.strAmpNumber2,
       req.body.caneCode,
       req.body.freezeDate3,
       req.body.strAmpNumber3,
       req.body.signatureB,
       req.body.etCodeB
    );

    for(var i=1;i<req.body.tableBRows+1; i++){
      var num = "number";
      var earTag = "earTag";
      var regNum = "regNum";
      var tattoo = "tattoo";
      var side = "side";
      var breedCode = "breedCode";
      var daysSinceEstrus = "daysSinceEstrus";
      var stageCode = "stageCodeB";
      var qualityCode = "qualityCodeB";
      var embryoDivided = "embryoDivided";
      var comments = "commentsB";
      var results = "results";
      if(i != 1){
        var num = "number"+i.toString();
        var earTag = "earTag"+i.toString();
        var regNum = "regNum"+i.toString();
        var tattoo = "tattoo"+i.toString();
        var side = "side"+i.toString();
        var breedCode = "breedCode"+i.toString();
        var daysSinceEstrus = "daysSinceEstrus"+i.toString();
        var stageCode = "stageCodeB"+i.toString();
        var qualityCode = "qualityCodeB"+i.toString();
        var embryoDivided = "embryoDivided"+i.toString();
        var comments = "commentsB"+i.toString();
        var results = "results"+i.toString();
      }
      db.run("INSERT INTO bSectionRows (bSectionDonorId, bSectionformAbcDate, bSectionNum, bSectionEarTag, bSectionRegNum, bSectionTattoo, bSectionSide" +
         ", bSectionBreedCode, bSectionDaysSinceEstrus, bSectionStageCode, bSectionQualityCode, bSectionEmbryoDivided, bSectionComments, bSectionResults) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
         req.body.tag,
         formatted,
         req.param(num),
         req.param(earTag),
         req.param(regNum),
         req.param(tattoo),
         req.param(side),
         req.param(breedCode),
         req.param(daysSinceEstrus),
         req.param(stageCode),
         req.param(qualityCode),
         req.param(embryoDivided),
         req.param(comments),
         req.param(results)
      );
    }

    var grades = [0, 0, 0];
    for(var i=1; i<parseInt(req.body.tableCRows)+1; i++){
      var numEmbryos = "numEmbryos";
      var stageCode = "stageCode";
      var qualityCode = "qualityCode";
      if(i != 1){
        numEmbryos = numEmbryos + i.toString();
        stageCode = stageCode + i.toString();
        qualityCode = qualityCode + i.toString();
      }
      for(var j=1; j<4; j++){
        if(parseInt(req.param(qualityCode)) == j){
          if(req.param(numEmbryos).indexOf("-") > -1){
            var nums = req.param(numEmbryos).split("-");
            var total = parseInt(nums[1])-parseInt(nums[0])+1;
            grades[j-1] += total;
          }
          else{
            grades[j-1] += 1;
          }
        }
      }
    }
    total = grades[0] + grades[1] + grades[2];
    console.log(grades);
    console.log(total);
    db.run("INSERT INTO cSection (cSectionDonorId, cSectionformAbcDate, cSectionTypeContainer, cSectionTimeRecoveryToOnset, cSectioncryoprotectant, cSectionSeedTemp, cSectionCoolingRate" +
       ", cSectionPlungeTemp, cSectionThawingMethod, cSectionSignature, cSectionETCode, cSectionStimPGM, cSectionCollHr, cSectionCollTech, cSectionStimStatus, cSectionComments, cSectionNumEmbryos" +
       ", cSectionnumUFO, cSectionnumDeg, cSectionNumTransferred, cSectionNumFrozen, cSectionNumSplit, cSectionTransHr, cSectionLoc, cSectionComments2, cSectionGrade1, cSectionGrade2" +
       ", cSectionGrade3, cSectionTotal) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
       req.body.tag,
       formatted,
       req.body.containerType,
       req.body.recoveryToFreezingTime,
       req.body.cryoFinalMol,
       req.body.seedTemp,
       req.body.coolingRate,
       req.body.plungeTemp,
       req.body.thawingMethod,
       req.body.signatureC,
       req.body.etCode3,
       req.body.stimPgm,
       req.body.collHr,
       req.body.collTech,
       req.body.stimStatus,
       req.body.comments3,
       req.body.numEmb,
       req.body.numUFO,
       req.body.numDeg,
       req.body.numTrans,
       req.body.numFrozen2,
       req.body.numSplit,
       req.body.transHr,
       req.body.loc,
       req.body.comments,
       grades[0],
       grades[1],
       grades[2],
       total
    );

    for(var i=1;i<req.body.tableCRows+1; i++){
      var locDonor = "locDonor";
      var caneNum = "caneNum";
      var strAmpNum = "strAmpNum";
      var numEmbryos = "numEmbryos";
      var numXWashed= "numXWashed";
      var stageCode = "stageCode";
      var qualityCode = "qualityCode";
      var zoneIntact = "zoneIntact";
      var divided = "divided";
      var trypsinRaised = "trypsinRaised";
      var tank = "tank";
      var canister = "canister";
      var commentsC = "commentsC";
      if(i != 1){
        var locDonor = "locDonor"+i.toString();
        var caneNum = "caneNum"+i.toString();
        var strAmpNum = "strAmpNum"+i.toString();
        var numEmbryos = "numEmbryos"+i.toString();
        var numXWashed= "numXWashed"+i.toString();
        var stageCode = "stageCode"+i.toString();
        var qualityCode = "qualityCode"+i.toString();
        var zoneIntact = "zoneIntact"+i.toString();
        var divided = "divided"+i.toString();
        var trypsinRaised = "trypsinRaised"+i.toString();
        var tank = "tank"+i.toString();
        var canister = "canister"+i.toString();
        var commentsC = "commentsC"+i.toString();
      }
      db.run("INSERT INTO cSectionRows (cSectionDonorId, cSectionformAbcDate, cSectionFreezeCode, cSectionCaneNum, cSectionStrNum, cSectionNumEmbryos, cSectionNumWashed" +
         ", cSectionStageCode, cSectionQualityCode, cSectionZoneIntact, cSectionDivided, cSectionTrypsinRaised, cSectionTank, cSectionCanister, cSectionComments) values (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
         req.body.tag,
         formatted,
         req.param(locDonor),
         req.param(caneNum),
         req.param(strAmpNum),
         req.param(numEmbryos),
         req.param(numXWashed),
         req.param(stageCode),
         req.param(qualityCode),
         req.param(zoneIntact),
         req.param(divided),
         req.param(trypsinRaised),
         req.param(tank),
         req.param(canister),
         req.param(commentsC)
      );
    }
    res.render('forms/formAbc', {user: req.user});
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
                var collection = "collNum" + i.toString();
                var date = "collDate" + i.toString();
                var numEmbryos = "numEmbryos" + i.toString();
                var numTrans = "numTrans" + i.toString();
                var numFrozen = "numFrozen" + i.toString();
                var numDegen = "numDegen" + i.toString();
                var numUnfertil = "numUnfertil" + i.toString();
                var sire = "sire" + i.toString();
                var numPreg = "numPreg" + i.toString();
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
            var date = "date" + i.toString();
            var rightOvary = "rightOvary" + i.toString();
            var leftOvary = "leftOvary" + i.toString();
            var ut = "ut" + i.toString();
            var tubbNum = "tubbNum" + i.toString();
            var comments = "comments" + i.toString();
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
    // var form = new formidable.IncomingForm();
    // form.parse(req, function(err, fields, files) {
    //   if (err) {
    //     console.log(err);
    //     req.end(500);
    //   }
    //   console.log(fields);
    //   var clientName = fields.clientname;
    //   console.log("client name:", clientName);
    //   res.render('forms/individualDonorFile', {user: req.user});
    // });
    console.log("tag", req.params.tag);
    console.log("client", req.params.client);

    var client = req.params.client;
    var donor = {
      hello: client
    };

    res.render('forms/individualDonorFile', {user: req.user, donor: donor});
  }
}


module.exports = exports = new Forms();
