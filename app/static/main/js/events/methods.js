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
var Stopprint= function () {
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/job",
  "method": "POST",
  "headers": {
  	"x-api-key": ActiveApi,
	  "content-type": "application/json",
	  "cache-control": "no-cache"
  },
  "processData": false,
  "data": '{"command": "cancel"}',
  "success": function(response) {
  	//alert(response);
	  console.log(response + ' -- success stoping print');
	  //Connected();
	  },
  "error": function(response) {
  	//CheckedConnect(30);
  	console.log(response + " - Error stopping print");
  	//$('.label_status').text('не удалось подключиться');
  	//var status = document.getElementById("status");
  	//status.innerText = "Не удалось подключиться";
                }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
};
function Calibrate() {
    "use strict";
    var command = '{"commands": ["M206 Z0", "M666 X0 Y0 Z0", "G32", "G31", "G28", "G1 Z22.1 F2000", "G30 Y0", "M374", "M500", "G28"]}';
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
	  console.log(response + ' -- success send command to calibrate');
	  },
  "error": function(response) {
      console.log(response + " - Error send command to calibrate");
  }
};
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
};
var RestartSoftware= function () {
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/system/commands/core/restart",
  "method": "POST",
  "headers": {
  	"x-api-key": ActiveApi,
	  "content-type": "application/json",
	  "cache-control": "no-cache"
  },
  "processData": false,
  "success": function(response) {
  	//alert(response);
	  console.log(response + ' -- response');
	  //Connected();
	  },
  "error": function(response) {
  	//CheckedConnect(30);
  	console.log(response + " - Error get response");
  	//$('.label_status').text('не удалось подключиться');
  	//var status = document.getElementById("status");
  	//status.innerText = "Не удалось подключиться";
                }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
};
var Reset_plate= function () {
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/system/commands/custom/reset_pl",
  "method": "POST",
  "headers": {
  	"x-api-key": ActiveApi,
	  "content-type": "application/json",
	  "cache-control": "no-cache"
  },
  "processData": false,
  //"data": '{"command": "reset_pl"}',
  "success": function(response) {

	  console.log(response + ' -- success reset plate');

	  },
  "error": function(response) {

  	console.log(response + " - Error stopping print");

                }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
};
var M999 = function () {
    var command4 = '{"command": "M999"}';
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
  "data": command4,
  "success": function(response) {
	  console.log(response + ' -- success send M999');
	  },
  "error": function(response) {
      console.log(response + " - Error send M999 command");
  }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
};
var RestartPlatform= function () {
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/system/commands/core/reboot",
  "method": "POST",
  "headers": {
  	"x-api-key": ActiveApi,
	  "content-type": "application/json",
	  "cache-control": "no-cache"
  },
  "processData": false,
  "success": function(response) {
  	//alert(response);
	  console.log(response + ' -- response');
	  //Connected();
	  },
  "error": function(response) {
  	//CheckedConnect(30);
  	console.log(response + " - Error get response");
  	//$('.label_status').text('не удалось подключиться');
  	//var status = document.getElementById("status");
  	//status.innerText = "Не удалось подключиться";
                }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
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
    OctoPrint.files.select(location, decodeURI(name_file), true)
        .done(function (response) {
            console.log(response);
        });
    console.log(location, name_file);
};
var GetFiles = function (url) {
    "use strict";
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
};
