$(document).ready(function(){
  color = "";
  $("#table tr").click(function(){
    id = $(this).closest('tr').attr('id');
    color = $("#"+id).css("background-color");
    if(color != "rgb(134, 171, 232)"){
      $("#table tr").css('background-color', 'rgb(255, 255, 255)');
      $("#"+id).css('background-color', 'rgb(134, 171, 232)');
    }
    else{
      $("#"+id).css('background-color', 'rgb(255, 255, 255)');
    }
  })

  $("#table").hover(function(){
    $("#table").css('cursor', 'pointer');
  })

  $("#submit").click(function(e){
    var foundRow = false;
    var table = document.getElementById('table');
    var rows = table.rows.length;
    for(var i=1; i<rows; i++){
      id = table.rows[i].id;
      if($("#"+id).css('background-color') == 'rgb(134, 171, 232)'){
        foundRow = true;
        $("#rowID").val(id);
      }
    }
    if(foundRow == false){
      alert("A row from the table must be selected.");
      e.preventDefault();
    }
  });
});
