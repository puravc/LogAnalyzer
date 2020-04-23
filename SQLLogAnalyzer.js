/* import * as fs from './fs';*/

$(function() {
  var MainData = "";
  var ViewNav = false;
  var AppletAct = false;
  var WorkflowTask = false;
  var BusinessService = false;
  var TaskNavigation = false;
  var Errors = false;
  var SQLExecute = false;
  var SQLInitialFetch = false;
  var SQLPrepare = false;
  var SQLInsert = false; //purav
  var SQLUpdate = false; //purav
  var SQLExecThresh = 0.1;
  var SQLInitThresh = 0.1;
  var SQLPrepThresh = 0.1;

  var SQLThreshDefault = 0.1;
  var SQLId = "";
	$('#output').text("");
	$('#output2').text("");
/*	const fs = require('fs') 
	fs.readFile('Input.txt', (err, data) => { 
    if (err) throw err;   
    console.log(data.toString()); 
	}) 
*/	

  $("#fileInput").on("change", function(e) {
    var input = e.target;
    var reader = new FileReader();
    reader.onload = function() {
      var text = reader.result;
      MainData = text;
      ReloadData(MainData);
    };
    reader.readAsText(input.files[0]);
	
	$("#SQLOption").html("");
	
  });  
 
  $(".SelectCheckbox").on("change", function(e) {
	
	SQLExecute = $('#SQLExecute').is(':checked');    
	if (SQLExecute) {
      $(".SQLThreshold").removeClass('DisplayNone');  
    } else {
      $(".SQLThreshold").addClass('DisplayNone');
    }	
	SQLInitialFetch = $('#SQLInitialFetch').is(':checked');    
	if (SQLInitialFetch) {
      $(".SQLInitial").removeClass('DisplayNone');
    } else {
      $(".SQLInitial").addClass('DisplayNone');
    }
    SQLPrepare = $('#SQLPrepare').is(':checked');    
	if (SQLPrepare) {
      $(".SQLPrepare").removeClass('DisplayNone');
    } else {
      $(".SQLPrepare").addClass('DisplayNone');
    }
	SQLInsert = $('#SQLInsert').is(':checked');//purav
	SQLUpdate = $('#SQLUpdate').is(':checked');//purav
	//Hide Output Area's if no checkbox is selected
	if (SQLExecute || SQLInitialFetch || SQLPrepare || SQLInsert || SQLUpdate){//purav
		$("#output").removeClass('DisplayNone');
		$("#output2").removeClass('DisplayNone');
	}
	else {
		$("#output").addClass('DisplayNone');
		$("#output2").removeClass('DisplayNone');
	}
    ReloadData(MainData);
  });


/************************************Main function Invoked on Checkbox click**********************************/
  function ReloadData(text) {  
    var x = text.split('\r');
    var len = x.length;
    var Str = "";
    for (i = 0; i < len; i++) {
	  d = x[i];
	  if (Errors && d.indexOf('ObjMgrLog	Error') >= 0) {
        Str = Str + 'Line : ' + (i + 1) + ' ' + d + '\n';
      } 
	  
	  else if (SQLExecute && d.indexOf('SQL Statement Execute Time for SQL Cursor with ID ') > 0) {
        l = d.indexOf('SQL Statement Execute Time for SQL Cursor with ID ');
        l = l + ('SQL Statement Execute Time for SQL Cursor with ID ').length;
        f = d.substring(l, d.length);
        SQLId = f.substring(0, f.indexOf(':'));
        sTime = f.substring(f.indexOf(':') + 1, f.indexOf('seconds') - 1);
        if (Number(sTime) > SQLExecThresh) {
			opt = "SQL Statement Execute Time for SQL Cursor with ID " + SQLId + ":" + sTime + ' seconds';
			Str = Str + 'Line : ' + (i + 1) + ' ' + opt + '\n'; 
        }
      }
	  else if (SQLInitialFetch && d.indexOf('SQL Statement Initial Fetch Time for SQL Cursor with ID ') > 0) {
        l = d.indexOf('SQL Statement Initial Fetch Time for SQL Cursor with ID ');
        l = l + ('SQL Statement Initial Fetch Time for SQL Cursor with ID ').length;
        f = d.substring(l, d.length);
        SQLId = f.substring(0, f.indexOf(':'));
        sTime = f.substring(f.indexOf(':') + 1, f.indexOf('seconds') - 1);
        if (Number(sTime) > SQLInitThresh) {
			opt = "SQL Statement Initial Fetch Time for SQL Cursor with ID " + SQLId + ":" + sTime + ' seconds';
			Str = Str + 'Line : ' + (i + 1) + ' ' + opt + '\n'; 
        }
      }
	  else if (SQLPrepare && d.indexOf('SQL Statement Prepare Time for SQL Cursor with ID ') > 0) {
        l = d.indexOf('SQL Statement Prepare Time for SQL Cursor with ID ');
        l = l + ('SQL Statement Prepare Time for SQL Cursor with ID ').length;
        f = d.substring(l, d.length);
        SQLId = f.substring(0, f.indexOf(':'));
        sTime = f.substring(f.indexOf(':') + 1, f.indexOf('seconds') - 1);
        if (Number(sTime) > SQLPrepThresh) {
			opt = "SQL Statement Prepare Time for SQL Cursor with ID " + SQLId + ":" + sTime + ' seconds';
			Str = Str + 'Line : ' + (i + 1) + ' ' + opt + '\n'; 
        }
      }
    }
	
    $('#output').text(Str);
	$('#output2').text("");
    FormatText();
  }
/************************************End Main function Invoked on Checkbox click**********************************/
/*************************Calculate SQL Threshold time******************/
   $("#SQLExecuteTime").on('keyup', function() {
    NewVal = $(this).val();
    if (NewVal !== null && NewVal != "") {
      SQLExecThresh = NewVal;
    } else {
      SQLExecThresh = SQLThreshDefault;
    }
    ReloadData(MainData);
  });
  
  $("#SQLInitialTime").on('keyup', function() {
    NewVal = $(this).val();
    if (NewVal !== null && NewVal != "") {
      SQLInitThresh = NewVal;
    } else {
      SQLInitThresh = SQLThreshDefault;
    }
    ReloadData(MainData);
  });
  
  $("#SQLPrepareTime").on('keyup', function() {
    NewVal = $(this).val();
    if (NewVal !== null && NewVal != "") {
      SQLPrepThresh = NewVal;
    } else {
      SQLPrepThresh = SQLThreshDefault;
    }
    ReloadData(MainData);
  });
 /*document.getElementById("output")
 window.addEventListener("load", eventWindowLoaded, false);
 function eventWindowLoaded(){
 $("#output").onclick = function (){
  //  SQLId = $(this).attr("value");
    var IdText = $(this).text();
    return false;
  };
 }*/
/*************************End Calculate SQL Threshold time******************/
 // FormatText();
/*************************On Click display SQL in output2******************/
//Line : 43196 SQL Statement Execute Time for SQL Cursor with ID 415AEBD0: 0.151 seconds

	$("body").delegate(".CodeMirror-line span", "click", function (){
		var IdText = $(this).text();
		var l="", c="", f="", selLineNum="";
		var stext = MainData;
		
		if(SQLExecute || SQLInitialFetch || SQLPrepare){
			l = IdText.indexOf(' SQL Statement Execute Time for SQL Cursor with ID ');
			if(l !== -1){
				m = IdText.indexOf(': '); n = IdText.indexOf(' SQL');
				selLineNum = IdText.substring(0,l);
				l = l + (' SQL Statement Execute Time for SQL Cursor with ID ').length;
				f = IdText.substring(l, IdText.length);		
				SQLId = f.substring(0, f.indexOf(':'));
			}else
			{
				l = IdText.indexOf(' SQL Statement Prepare Time for SQL Cursor with ID ');
				if(l !== -1){
					l = l + (' SQL Statement Prepare Time for SQL Cursor with ID ').length;
					f = IdText.substring(l, IdText.length);		
					SQLId = f.substring(0, f.indexOf(':'));
				}else
				{
					l = IdText.indexOf(' SQL Statement Initial Fetch Time for SQL Cursor with ID ');
					if(l === -1)
					{
						l = l + (' SQL Statement Initial Fetch Time for SQL Cursor with ID ').length;
						f = IdText.substring(l, IdText.length);		
						SQLId = f.substring(0, f.indexOf(':'));
					}
				}
			}
		}
	
		if (SQLId != "") {
		  var x = stext.split('\n')
		  var len = x.length;
		  var Str = IdText + '\n';
		  for (i = 0; i < len; i++) {
			d = x[i];
			if (d.indexOf('statement with ID: ' + SQLId) > 0) {
			  i++;
			  d = x[i];
			  do {
				Str = d + '\n' + Str;
				i++;
				d = x[i];
			  } while (d.indexOf('Bind variable') < 0)
			  do {
				Str = d + '\n' + Str;
				i++;
				d = x[i];
			  } while (d.indexOf('Bind variable') > 0)
			  break;
			}
		  }
		  $('#output2').text(Str);
		  FormatText2();
		}
	});
/*************************On Click display SQL in output2******************/

  function FormatText() {
    $('.output').each(function() {
      var $this = $(this),
        $code = $this.html(),
        $unescaped = $('<div/>').html($code).text();
		$this.empty();
      CodeMirror(this, {
        value: $unescaped,
        mode: 'Textile',
        lineWrapping: true,
        lineNumbers: !$this.is('.inline'),
        readOnly: true
      });
    });
  }
  
  function FormatText2() {
    $('.output2').each(function() {
      var $this = $(this),
        $code = $this.html(),
        $unescaped = $('<div/>').html($code).text();
		$this.empty();
      CodeMirror(this, {
        value: $unescaped,
        mode: 'Textile',
        lineWrapping: true,
        lineNumbers: !$this.is('.inline'),
        readOnly: true
      });
    });
  }
});
