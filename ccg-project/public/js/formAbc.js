"use strict";

$("#viewPdf").click(function(){
  var PDFDocument = require('pdfkit');
  var fs = require('fs');
  var blobStream  = require('blob-stream');
  var doc = new PDFDocument();
  var stream = doc.pipe(blobStream());
  var iframe = document.querySelector('iframe');
  var lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam in suscipit purus. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Vivamus nec hendrerit felis. Morbi aliquam facilisis risus eu lacinia. Sed eu leo in turpis fringilla hendrerit. Ut nec accumsan nisl. Suspendisse rhoncus nisl posuere tortor tempus et dapibus elit porta. Cras leo neque, elementum a rhoncus ut, vestibulum non nibh. Phasellus pretium justo turpis. Etiam vulputate, odio vitae tincidunt ultricies, eros odio dapibus nisi, ut tincidunt lacus arcu eu elit. Aenean velit erat, vehicula eget lacinia ut, dignissim non tellus. Aliquam nec lacus mi, sed vestibulum nunc. Suspendisse potenti. Curabitur vitae sem turpis. Vestibulum sed neque eget dolor dapibus porttitor at sit amet sem. Fusce a turpis lorem. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;\nMauris at ante tellus. Vestibulum a metus lectus. Praesent tempor purus a lacus blandit eget gravida ante hendrerit. Cras et eros metus. Sed commodo malesuada eros, vitae interdum augue semper quis. Fusce id magna nunc. Curabitur sollicitudin placerat semper. Cras et mi neque, a dignissim risus. Nulla venenatis porta lacus, vel rhoncus lectus tempor vitae. Duis sagittis venenatis rutrum. Curabitur tempor massa tortor.';
  var testingCode = $("#breed").val();
  document.getElementById("iframe-wrapper").style.display = "inline-block";
  //document.getElementById("window").style.backgroundColor = "black";
  //document.getElementById("window").style.opacity = "0.3";

  //doc.pipe(fs.createWriteStream('formAbc.pdf'));
	//  doc.pipe res; # HTTP response

	  //doc.end();
	  // draw some text
	doc.fontSize(25)
	   .text('Here are some vector graphics for...' + testingCode, 100, 80);

	// some vector graphics
	doc.save()
	   .moveTo(100, 150)
	   .lineTo(100, 250)
	   .lineTo(200, 250)
	   .fill("#FF3300");

	doc.circle(280, 200, 50)
	   .fill("#6600FF");

	// an SVG path
	doc.scale(0.6)
	   .translate(470, 130)
	   .path('M 250,75 L 323,301 131,161 369,161 177,301 z')
	   .fill('red', 'even-odd')
	   .restore();

	// and some justified text wrapped into columns
	doc.text('And here is some wrapped text...', 100, 300)
		.font('Times-Roman', 13)
		 .moveDown()
		 .text(lorem, {
		   width: 412,
		   align: 'justify',
		   indent: 30,
		   columns: 2,
		   height: 300,
		   ellipsis: true
		 });

	// end and display the document in the iframe to the right
	doc.end();
	stream.on('finish', function() {
	  iframe.src = stream.toBlobURL('application/pdf');
	});

});

$(function() {
  $(".datepicker").datepicker();
});

$("#close").click(function(){
	document.getElementById("iframe-wrapper").style.display = "none";
	document.getElementById("window").style.backgroundColor = "transparent";
	document.getElementById("window").style.opacity = "1.0";
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
  var array = ["locDonor", "caneNum", "strAmpNum", "numEmbryos", "numXWashed", "stageCode", "qualityCode", "zoneIntact", "divided", "trypsinRinsed", "tank", "canister", "commentsC"];
  var newRow = document.getElementById("tableC").insertRow(rows);
  for(var i=0;i<14;i++){
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
      if (i==13){
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

$("#tag").on('input', function() {
  autoFill();
});

$("#owner").on('input', function() {
  autoFill();
});

function autoFill() {
  //var data = {"test":"testingAjax"};
  var tag = $("#tag").val();
  var owner = $("#owner").val();

  if(tag != "" && owner != ""){
    var data = {tag: tag, owner: owner};
    var form = $('form');
    event.preventDefault();
    console.log('form');
    console.log(form);
    console.log('end form');
    $.ajax({
        method: 'POST',
        //Figure out the data passing through ajax
        data: data,
        //data: JSON.stringify({expression: "testexpression"}),
        //data: form.serialize(),
        //contentType: "application/json",
        //dataType:'json',
        url: '/formAbc',
        success: function(data) {
            console.log('success');
            console.log(data);
            console.log(data.name);
            $("#serviceSire1").val(data.name_donor);
            $("#breed").val(data.breed);
            $("#regNum1").val(data.reg_num);
            $("#freezeDate1").val(data.freeze_date);
            $("#estrusOnset").val(data.estrus_onset);
            $("#breedDate").val(data.breed_date);
            $("#recoveryDate").val(data.recovery_date);
            $("#numRecovered").val(data.num_recovered);
            $("#numTransferred").val(data.num_transferred);
            $("#numFrozen1").val(data.num_frozen);
            $("#etCodeA").val(data.et_code);
            $("#donor").val(data.name);
            $("#address").val(data.address);
            $("#regNum1").val(data.reg_num_sire);
            $("#idCode1").val(data.code_sire);
            //alert(JSON.stringify(data));
        },
        error: function(error) {
            console.log("Some error in fetching the notifications");
        }
    });
  }
}
