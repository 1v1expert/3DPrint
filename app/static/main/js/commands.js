/* Definite main func module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/

// Get all commands from system:
// OctoPrint.system.getCommands().done(function(response){console.log(response)})

"use strict";
var ActivePort = 5000;
var ActiveApi = "5C761F424E5E46EE934DE9F683609B66";
var URL = "http://127.0.0.1:" + String(ActivePort);
var settings = window || this;
settings = {
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
function CopyObjects(data) {
    var clone = {};
    for (var key in data) {
        clone[key] = data[key];
    }
    return clone;
}
function PrintObject(data) {
    var strobj = '';
    for (var key in data) {
        strobj += key + ': ' + data[key] + '\n';
    }
    console.log(strobj);
}
/*****Connect Octoprint Serve ******/
/*function ConnectPrinter() {
    var setting = CopyObjects(settings);
    setting.async = true;
    setting.url = URL + "/api/connection";
    setting.data = '{"command": "connect"}';
    setting.error = function () {
      App.is_connect_server = false;
    };
    setting.success = function () {
        App.is_connect_server = true;
    };
    $.ajax(setting).done(function (response) {
        console.log(setting, response);
    });
}*/

function Restart_touchui() {
    OctoPrint.system.executeCommand('custom', 'restart_touchui')
        .done('Success execute command: restart touchui')
        .error('Error execute command: restart touchui');
}

function SetTemperature_bed(temper) {
    var command = '{"command": "target", "target":' + temper + '}';
    settings.url = URL + '/api/printer/bed';
    settings.data = command;
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
}

function SetTemperature_tool(temper) {
    var setting = CopyObjects(settings);
    var command = '{"command": "target", "targets": {"tool0":' + temper + '}}';
    setting.url = URL + '/api/printer/tool';
    setting.data = command;
    $.ajax(setting).done(function (response) {
        console.log(response);
    });
}

var SystemTrigeredPrint = function () {
    var setting = settings;
    setting.url = URL + "/api/job";
    setting.method = "POST";
    setting.data = '{"command": "pause", "action": "pause"}';
    setting.async = true;
    setting.error = function (response) {
        console.log(response);
    };
    setting.success = function (response) {
        console.log(response);
    };
    if (global_state === 'Pausing' || global_state === 'Paused') {
        //alert('Pausing');
        console.log(global_state);
        setting.data = '{"command": "pause", "action": "resume"}';
    }
    console.log(setting);
    $.ajax(setting).done(function (response) {
        console.log('Done-->', response);
    });
};

function TrigeredPrint() {
    var command = Apps._settings.buttons.OnPause;
    if (Apps.Printer._state === 'Pausing' || Apps.Printer._state === 'Paused') {
        command = Apps._settings.buttons.CancPause;
    }
    console.log(command);
    Apps.PlayCommand(command);
}