/* Definite main func module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/
"use strict";
var ActivePort = 5000;
var ActiveApi = "5C761F424E5E46EE934DE9F683609B66";
var URL = "http://127.0.0.1:" + ActivePort + "/api/printer/";
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
var SetTemperature_bed = function (temper) {
    var command = '{"command": "target", "target":' +  temper + '}';
    settings.url = URL + 'bed';
    settings.data = command;
$.ajax(settings).done(function (response) {
    console.log(response);
});
};

var SetTemperature_tool = function (temper) {
    var command = '{"command": "target", "targets": {"tool0":' + temper + '}}';
    settings.url = URL + 'tool';
    settings.data = command;
$.ajax(settings).done(function (response) {
    console.log(response);
});
};


var Extrude = function (vtool, type_exchange) {
    var command = '{"command": "select", "tool": "' + vtool + '"}';
    var extrude = '{"command": "extrude", "amount":' + type_exchange + '}';
//select tool
    settings.url = URL + 'tool';
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

