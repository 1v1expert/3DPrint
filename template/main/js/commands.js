/* Definite main func module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/
"use strict";
var ActivePort = 5000;
var ActiveApi = "5C761F424E5E46EE934DE9F683609B66";
var URL = "http://127.0.0.1:" + String(ActivePort);
var settings = {
  "async": false,
  "crossDomain": true,
  "url": URL,
  //"http://127.0.0.1:" + ActivePort + "/api/printer/tool",
  "method": "POST",
  "headers": {
  	"x-api-key": ActiveApi,
	  "content-type": "application/json",
	  "cache-control": "no-cache"
  },
  "processData": false,
  "data": ''
};
/*****Connect Octoprint Serve ******/
var ConnectPrinter = function () {
    settings.async = true;
    settings.url = URL + "/api/connection";
    settings.data = '{"command": "connect"}';
    settings.error = function (response) {
      console.log('error->', settings.url, response);
    };
    settings.success = function (response) {
        is_connect_printer = true;
        console.log(response);
    };
    //console.log('connect printer');

  //"success": function(response) {
  	//alert(response);
	//  console.log(response + 'ConnectServ');
	 // Connected();
	 // },
  //"error": function(response) {
   //   clearInterval(GLOBAL_TIMER);
  //	CheckedConnect(5);
  //	console.log(response + 'Error connect serv');
 // 	$('.label_status').text('не удалось подключиться');
  	//var status = document.getElementById("status");
  	//status.innerText = "Не удалось подключиться";
   //             }
//};
$.ajax(settings).done(function (response) {console.log(settings, response);});
};
var SetTemperature_bed = function (temper) {
    var command = '{"command": "target", "target":' +  temper + '}';
    settings.url = URL + '/api/printer/bed';
    settings.data = command;
$.ajax(settings).done(function (response) {
    console.log(response);
});
};

var SetTemperature_tool = function (temper) {
    var command = '{"command": "target", "targets": {"tool0":' + temper + '}}';
    settings.url = URL + '/api/printer/tool';
    settings.data = command;
$.ajax(settings).done(function (response) {
    console.log(response);
});
};
var TrigeredPrint = function () {
    "use strict";
    var command = buttons.OnPause;
    alert('OnPause');
    console.log(global_state);
    if (global_state === 'Pausing' || global_state === 'Paused') {
        alert('Pausing');
        console.log(global_state);
        command = buttons.CancPause;
    }
    var setting = settings;
    setting.url = URL + '/api/printer/command';
    setting.method = 'POST';
    setting.data = command;
    setting.async = true;
    console.log(setting);
    $.ajax(setting).done(function (response) {
        console.log(response, setting);
    });
};

var Extrude = function (vtool, type_exchange) {
    var command = '{"command": "select", "tool": "' + vtool + '"}';
    var extrude = '{"command": "extrude", "amount":' + type_exchange + '}';
    //select tool
    settings.url = URL + '/api/printer/tool';
    settings.data = command;
    $.ajax(settings).done(function (response) {
        console.log(response,'settings ->' , settings);
    }
    );
    //extrude plastic
    settings.data = extrude;
    $.ajax(settings).done(function (response) {
        console.log(response, 'settings ->', settings);
    });
};

