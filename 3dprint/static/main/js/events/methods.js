/* Main methods module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/
var GetPosition = function () {
    "use strict";
    console.log('Get position');
    //M306 Z0 \n G28 \n M500
    var command = '{"commands": ["M114"]}';
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://127.0.0.1:" + ActivePort + "/api/printer/command",
        "method": "POST",
        "headers": {
            "x-api-key": ActiveApi,
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "data": command,
        "success": function(response) {
            console.log(response + ' -- success get response position');
            },
        "error": function(response) {
            console.log(response + " - Error get response position");
        }};
    $.ajax(settings).done(function (response) {console.log(response);});
};
var PrintHead = function (command) {
    "use strict";
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
};

var StartPrint = function (location, name_file) {
    "use strict";
    OctoPrint.files.select('local', decodeURI(name_file), true)
        .done(function (response) {
            console.log(response);
        });
    console.log(location, name_file);
};
var GetFiles = function (url) {
    "use strict";
    var data_html = "";
    OctoPrint.files.listForLocation('local?force=true', true)
        .done(function(response) {
            console.log("### Files:");
            _.each(response.files, function(entry) {
                console.log(entry);
                if (entry.children) {
                    if (entry.children.length > 0) {
                        for (var children in entry.children) {
                            data_html = data_html + "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-12  file-box'><div class='file'><a onclick=\"ConfirmPrint(\'" + children.path + "\' , \'" + children.name + "\') \" > <div class='icon'> <i class='zmdi zmdi-file-text'></i> </div> <div class='file-name'>" + children.display + "<br> <span>Доб: " + children.date + "</span> </div> </a> </div> </div>";
                        }
                    }
                }
                else {
                    data_html = data_html + "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-12  file-box'><div class='file'><a onclick=\"ConfirmPrint(\'" + entry.path + "\' , \'" + entry.name + "\') \" > <div class='icon'> <i class='zmdi zmdi-file-text'></i> </div> <div class='file-name'>" + entry.display + "<br> <span>Доб: " + entry.date + "</span> </div> </a> </div> </div>";
                }
            });
            if (url === "local?force=true&filter=gcode&recursive=true") {
                $('#usbfiles').css('visibility', 'visible');
                if ($('#usbfiles').hasClass('active')) {
                    $('#rowfiles').html(data_html);
                }
            }
            if (url === "sdcard?recursive=true") {
                if ($('#localfiles').hasClass('active')) {
                    $('#rowfiles').html(data_html);
                }}
    });
};
