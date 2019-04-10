/* Main methods module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/
"use strict";
function GetPosition() {
    Apps.PlayCommand("M114")
        .done('Success execute command: M114')
        .error('Error execute command: M114');
}
function Stopprint() {
    OctoPrint.job.cancel()
        .done(function (response) {
            console.log('Done cancel print', response);
        })
        .error(function (response) {
            console.log('Error cancel print', response);
        });
}
function Calibrate() {
    Apps.PlayCommand(["M206 Z0", "M666 X0 Y0 Z0", "G32", "G31", "G28", "G1 Z22.1 F2000", "G30 Y0", "M374", "M500", "G28"])
        .done('Success execute command: calibrate')
        .error('Error execute command: calibrate');
}
function RestartSoftware() {
    OctoPrint.system.executeCommand('core', 'restart')
        .done('Success execute command: restart touchui')
        .error('Error execute command: restart touchui');
    setTimeout(
        function(){Apps.Printer.ConnectPrinter();},
        5000);
}
function Reset_plate() {
    OctoPrint.system.executeCommand('custom', 'reset_pl')
        .done('Success execute command: reset plate')
        .error('Error execute command: reset plate');
}
function M999() {
    Apps.PlayCommand("M999")
        .done('Success execute command: M999')
        .error('Error execute command: M999');
}
function RestartPlatform() {
    OctoPrint.system.executeCommand('core', 'reboot')
        .done('Success execute command: reset plate')
        .error('Error execute command: reset plate');
}
function PrintHead(command) {
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/printer/printhead",
  "method": "POST",
  "headers": {
  	"x-api-key": ActiveApi,
	  "content-type": "application/json",
	  "cache-control": "no-cache"
  },
  "processData": false,
  "data": String(command),
  "success": function (response) {
  	//alert('Успешно', response);
  },
  "error": function (response) {
  	//alert('Не успешно', response);
  }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
}
function StartPrint(location, name_file) {
    OctoPrint.files.select(location, decodeURI(name_file), true)
        .done(function (response) {
            console.log(response);
        });
    console.log(location, name_file);
}
function CustomGetFiles() {
    var data_html = "";
    $.ajax(
        {
            "async": true,
            "url": "http://localhost:5001/manage_file",
            "method": "GET"
    }).done(function (response){
        console.log(response);
        _.each(JSON.parse(response).files, function(entry) {
            data_html = data_html + "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-12  file-box'><div class='file'><a onclick=\"ConfirmCopy(\'" + entry.path + "\' , \'" + entry.name + "\') \" > <div class='icon'> <i class='zmdi zmdi-file-text'></i> </div> <div class='file-name'>" + entry.name + "<br> </div> </a> </div> </div>";
        });
        $('#rowfiles').html(data_html);
        //alert(response);
    })
        .error(function (message) {
            alert(message);
            //console.log(message);

        });
}
function GetFiles(url) {
    var data_html = "";
    OctoPrint.files.listForLocation(url, true)
        .done(function(response) {
            console.log("### Files:");
            _.each(response.files, function(entry) {
                console.log(entry);
                if (entry.children) {
                    if (entry.children.length > 0) {
                        for (var children in entry.children) {
                            data_html = data_html + "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-12  file-box'><div class='file'><a onclick=\"ConfirmPrint(\'" + children.origin + "\' , \'" + children.name + "\') \" > <div class='icon'> <i class='zmdi zmdi-file-text'></i> </div> <div class='file-name'>" + children.display + "<br> <span>Доб: " + moment.unix(children.date).format("MM:DD:YYYY") + "</span> </div> </a> </div> </div>";
                        }
                    }
                }
                else {
                    data_html = data_html + "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-12  file-box'><div class='file'><a onclick=\"ConfirmPrint(\'" + entry.origin + "\' , \'" + entry.name + "\') \" > <div class='icon'> <i class='zmdi zmdi-file-text'></i> </div> <div class='file-name'>" + entry.display + "<br> <span>Доб: " + moment.unix(entry.date).format("MM:DD:YYYY") + "</span> </div> </a> </div> </div>";
                }
            });
            if (url === 'local?force=true') {
                $('#usbfiles').css('visibility', 'visible');
                if ($('#usbfiles').hasClass('active')) {
                    $('#rowfiles').html(data_html);
                }
            }
            if (url === 'sdcard?force=true') {
                if ($('#localfiles').hasClass('active')) {
                    $('#rowfiles').html(data_html);
                }}
    });
}