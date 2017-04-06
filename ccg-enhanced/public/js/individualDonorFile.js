$(document).ready(function(){
  var pathname = window.location.href;
  if(pathname.indexOf("donorTag") >= 0){
    $("#submit").prop('disabled', 'true');
    var id = pathname.split("=").pop();
    var data = {id: id, ajax: "true"};
    $.ajax({
        method: 'POST',
        data: data,
        url: '/individualDonorFile',
        success: function(data) {
            console.log('success');
            console.log(data);
            console.log("Data above");
            $("#idNum").val(data.donorTag);
            /*$("#regNum1").val(data.donorRegNum);
            $("#donor").val(data.donorName);
            $("#address").val(data.clientAddress);
            $("#serviceSire1").val(data.sireName);
            $("#regNum1").val(data.donorRegNum);
            $("#regNum2").val(data.sireRegNum);
            //alert(JSON.stringify(data));*/
        },
        error: function(error) {
            console.log("Some error in fetching the notifications.");
        }
    });
  }
  $("#submit").click(function(e){
    if($("#idNum").val() != "" && $("#owner").val() != ""){
      //var form = $("#window").serialize();
    }
    else{
      alert("At least the ID number and owner must be filled out to submit a form.");
      e.preventDefault();
    }
  });

    //Adds rows to the B table
  $(".plus").click(function(){
  var table = $(this).parents("table:first").attr("id");
  rows = $("#"+table+" tr").length;
  cols = $("#"+table+" tr:first-child td").length;
  var index = 0;
  if(rows < 13){
    var array = [];
    for(i=2;i<=cols;i++){
      array[i-2] = $("#" + table + " tbody tr:nth-child(2) td:nth-child(" + i + ") input").attr("id");
    }
    var newRow = document.getElementById(table).insertRow(rows);
    for(var i=0;i<cols;i++){
      if(i==0){
        var td = newRow.insertCell(i);
        index--;
      }
      else{
        var td = newRow.insertCell(i);
        var textbox = document.createElement("input");
        textbox.id = array[index].substring(0, array[index].length - 1) + rows;
        textbox.name = array[index].substring(0, array[index].length - 1) + rows;
        textbox.class = "smallLine";
        textbox.type = "text";
        td.appendChild(textbox);
        $(td).attr("colspan",2);
      }
      index++;
    }
    $("#" + table + "Rows").val(parseInt($("#" + table + "Rows").val()) + 1);
  }
  else{
    alert("Cannot have more than 12 rows");
  }
  });

  //Subtracts rows from the B table
  $(".minus").click(function(){
    var table = $(this).parents("table:first").attr("id");
    rows = $("#"+table+" tr").length;
    if(rows>2){
      document.getElementById(table).deleteRow(rows-1);
      $("#" + table + "Rows").val(parseInt($("#" + table + "Rows").val()) - 1);
    }
    else{
    alert("Must have at least one row");
    }
  });

});
