"use strict";

$("#viewPdf").click(function(){
  var PDFDocuments = require('pdfkit');
  var fs = require('fs');
  doc = new PDFDocument();

  doc.pipe(fs.createWriteStream('formAbc.pdf'));
//  doc.pipe res; # HTTP response

  doc.end();

});

$(function() {
  $(".datepicker").datepicker();
});

//Adds rows to the B table
$("#plusB").click(function(){
var rows = document.getElementById("tableB").rows.length;
var index = 0;
if(rows < 13){
  var array = ["number", "earTag", "regNum", "tattoo", "side", "breedCode", "daysSinceEstrus", "stageCode", "qualityCode", "embyroDivided", "commentsB", "results"];
  var newRow = document.getElementById("tableB").insertRow(rows);
  for(var i=0;i<13;i++){
    if(i==0){
      var td = newRow.insertCell(i);
      index--;
    }
    else{
      var td = newRow.insertCell(i);
      var textbox = document.createElement("input");
      textbox.id = array[index] + rows;
      textbox.name = array[index] + rows;
      textbox.class = "smallLine";
      textbox.type = "text";
      td.appendChild(textbox);
      if (i==11){
        $(td).attr("colspan",2);
      }
    }
    index++;
  }
}
else{
  alert("Cannot have more than 12 rows");
}
});

//Subtracts rows from the B table
$("#minusB").click(function(){
var rows = document.getElementById("tableB").rows.length;
if(rows>2){
  document.getElementById("tableB").deleteRow(rows-1);
}
else{
alert("Must have at least one row");
}
});

//Adds rows to the C table
$("#plusC").click(function(){
var rows = document.getElementById("tableC").rows.length;
var index = 0;
if(rows < 13){
  var array = ["caneNum", "strAmpNum", "numEmbryos", "numXWashed", "stageCode", "qualityCode", "zoneIntact", "divided", "trypsinRinsed", "commentsC"];
  var newRow = document.getElementById("tableC").insertRow(rows);
  for(var i=0;i<11;i++){
    if(i==0){
      var td = newRow.insertCell(i);
      index--;
    }
    else{
      var td = newRow.insertCell(i);
      var textbox = document.createElement("input");
      textbox.id = array[index] + rows;
      textbox.name = array[index] + rows;
      textbox.class = "smallLine";
      textbox.type = "text";
      td.appendChild(textbox);
      if (i==1){
        $(td).attr("colspan",2);
      }
      if (i==10){
        $(td).attr("colspan",2);
      }
    }
    index++;
  }
}
else{
  alert("Cannot have more than 12 rows");
}
});

//Subtracts rows from the C table
$("#minusC").click(function(){
var rows = document.getElementById("tableC").rows.length;
if(rows>2){
  document.getElementById("tableC").deleteRow(rows-1);
}
else{
alert("Must have at least one row");
}
});
