/** *************Init JS*********************

    TABLE OF CONTENTS
	---------------------------
	1.Ready function
	2.Load function
	3.Full height function
	4.Jetson function
	5.Chat App function
	6.Resize function
 ** ***************************************/

 "use strict";


/***** Connected *****/
var ApiKeyDev = "E39CDD5E459A4493A6AC51204115204D";
var ApiKeyProd ="A1DF8B0B3E6743448D60194EAC0F0772";
var ApiRasp = "5C761F424E5E46EE934DE9F683609B66";
var ActiveApi = ApiRasp;
var PortProd = 5000;
//var PortTest = 8112;
var ActivePort = PortProd;
var URL = "//127.0.0.1:" + ActivePort;
var UrlSocket = "ws:" + URL + "/sockjs/627/mvy2qfdj/websocket";

var idIntervals=0;
var TARGET = 300;

var PRINT_PAUSE = false;

$('#extrude_1').on('click', function () {
    Extrude("tool0", "5");
}
);
$('#retruct_1').on('click', function () {
    Extrude("tool0", "-5");
});
$('#extrude_2').on('click', function () {
    Extrude("tool1", "5");
});
$('#retruct_2').on('click', function () {
    Extrude("tool1", "-5");
});

$('#up_t_tool').on('click', function () {
    var t = $('#t_tool').text();
    var c_t = +t;
    $('#t_tool').text(c_t+1);
});

$('#down_t_tool').on('click', function () {
    var t = $('#t_tool').text();
    var c_t = +t;
    $('#t_tool').text(c_t-1);
});

$('#up_t_board').on('click', function () {
    var t = $('#t_board').text();
    var c_t = +t;
    $('#t_board').text(c_t+1);
});

$('#down_t_board').on('click', function () {
    var t = $('#t_board').text();
    var c_t = +t;
    $('#t_board').text(c_t-1);
});
$('#zero_temp_board').on('click', function () {
    $('#t_board').text(0);
});
$('#zero_temp_tool').on('click', function () {
    $('#t_tool').text(0);
});

$('#set_temp_tool').on('click', function () {
    var t = $('#t_tool').text();
    var c_t = +t;
    SetTemperature_tool(c_t);
});

$('#set_temp_board').on('click', function () {
    var t = $('#t_board').text();
    var c_t = +t;
    SetTemperature_bed(c_t);
});

$('#restart_touchui').on('click', function () {
    Restart_touchui();
});

//restart_touchui

$('#restartprint').on('click', function () {
    $('#status_print').text("ПЕЧАТЬ ПРЕРВАНА");
    RestartPrint();
});
$('#stopprint').on('click', function () {
    //Add change name status
    $('#status_print').text("ПЕЧАТЬ ПРЕРВАНА");
    Stopprint();
});
//pauseprint_2
$('#pauseprint_2').on('click', function () {
    if (PRINT_PAUSE){
        $('#status_print').text("ИДЁТ ПЕЧАТЬ...");
        $('#iconpause').text(' Приостановить');
        RESUMES_PRINTING();
        PRINT_PAUSE = false;
    }
    else {
        $('#status_print').text("ПЕЧАТЬ ПРИОСТАНОВЛЕНА");
        $('#iconpause').text(' Продолжить');
        PAUSE_PRINTING();
        PRINT_PAUSE = true;
    };
});

$('#pauseprint').on('click', function () {
    if (PRINT_PAUSE){
        $('#status_print').text("ИДЁТ ПЕЧАТЬ...");
        $('#iconpause').text(' Приостановить');
        //RESUME_PRINTING();
        PRINT_PAUSE = false;
    }
    else {
        $('#status_print').text("ПЕЧАТЬ ПРИОСТАНОВЛЕНА");
        $('#iconpause').text(' Продолжить');
        PRINT_PAUSE = true;
    };
    TogglePrint();
});

$('#platform_restart').on('click', function () {
    console.log('Platform_restart');
    RestartPlatform();
});
$('#restart_software').on('click', function () {
    console.log('restart_software');
    RestartSoftware();
});

$('#M999').on('click', function () {
    M999();
});

$('#calibr').on('click', function () {
    console.log('restart_software');
    Calibrate();
});
$('#reset_pl').on('click', function () {
    console.log('restart_pl');
    Reset_plate();
});

$('#m306').on('click', function () {
    console.log('m306');
    //Reset_plate();
    M306();
});

var M306 = function () {
    //M306 Z0 \n G28 \n M500
    var command4 = '{"commands": ["M306 Z0", "G28", "M500"]}';
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
	  console.log(response + ' -- success M306');
	  },
  "error": function(response) {
      console.log(response + " - Error M306");
  }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
};

var PAUSE_PRINTING = function () {
    var command4 = '{"command": "M600"}';
    //'{"command": "M999"}';
    //G91|G1_Z+15_F3000|G90|G1_X-50_Y-50
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
	  console.log(response + ' -- success resume printing');
	  },
  "error": function(response) {
      console.log(response + " - Error ruseme printing");
  }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
};

var RESUMES_PRINTING = function () {
    var command4 = '{"command": "M601"}';
    //'{"command": "M999"}';
    //G91|G1_Z+15_F3000|G90|G1_X-50_Y-50
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
	  console.log(response + ' -- success resume printing');
	  },
  "error": function(response) {
      console.log(response + " - Error ruseme printing");
  }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
};

var Restart_touchui= function () {
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/system/commands/custom/restart_touchui",
  "method": "POST",
  "headers": {
  	"x-api-key": ActiveApi,
	  "content-type": "application/json",
	  "cache-control": "no-cache"
  },
  "processData": false,
  //"data": '{"command": "restart_touchui"}',
  "success": function(response) {
	  console.log(response + ' -- success restart');
	  },
  "error": function(response) {
  	console.log(response + " - Error restart touchui");
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

var Calibrate = function () {
    var command4 = '{"commands": ["M206 Z0", "M666 X0 Y0 Z0", "G32", "G31", "G28", "G1 Z22.1 F2000", "G30 Y0", "M374", "M500", "G28"]}';
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


var SetTemperature_bed = function (temper) {
    var command4 = '{"command": "target", "target":' +  temper + '}';
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://127.0.0.1:" + ActivePort + "/api/printer/bed",
        "method": "POST",
        "headers": {
            "x-api-key": ActiveApi,
            "content-type": "application/json",
            "cache-control": "no-cache"
  },
  "processData": false,
  "data": command4,
  "success": function(response) {
	  console.log(response + ' -- success set temperature');
	  },
  "error": function(response) {
      console.log(response + " - Error set temperature");
  }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
};

var SetTemperature_tool = function (temper) {
    var command3 = '{"command": "target", "targets": {"tool0":' + temper + '}}';
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://127.0.0.1:" + ActivePort + "/api/printer/tool",
        "method": "POST",
        "headers": {
            "x-api-key": ActiveApi,
            "content-type": "application/json",
            "cache-control": "no-cache"
  },
  "processData": false,
  "data": command3,
  "success": function(response) {
	  console.log(response + ' -- success set temperature');
	  },
  "error": function(response) {
      console.log(response + " - Error set temperature");
  }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
};

var Extrude = function (vtool, type_exchange) {
    var command = '{"command": "select", "tool": "' + vtool + '"}';
    var command2 = '{"command": "extrude", "amount":' + type_exchange + '}';
    var select_tool = {
  "async": false,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/printer/tool",
  "method": "POST",
  "headers": {
  	"x-api-key": ActiveApi,
	  "content-type": "application/json",
	  "cache-control": "no-cache"
  },
  "processData": false,
  "data": command,
  "success": function(response) {
	  console.log(response + ' -- success selecting');
	  },
  "error": function(response) {
      console.log(response + " - Error selecting");
  }
};
var settings = {
  "async": false,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/printer/tool",
  "method": "POST",
  "headers": {
  	"x-api-key": ActiveApi,
	  "content-type": "application/json",
	  "cache-control": "no-cache"
  },
  "processData": false,
  "data": command2,
  "success": function(response) {
	  console.log(response + ' -- success extruding/retract');
	  },
  "error": function(response) {
      console.log(response + " - Error extruding/retract");
  }
};
$.ajax(select_tool).done(function (response) {
    console.log(response,'settings ->' ,select_tool);
});
$.ajax(settings).done(function (response) {
    console.log(response, 'settings ->', settings);
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

var RestartPrint= function () {
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
  "data": '{"command": "restart"}',
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

var TogglePrint= function () {
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
  "data": '{"command": "pause", "action": "toggle"}',
  "success": function(response) {
  	//alert(response);
	  console.log(response + ' -- success toggle print');
	  //Connected();
	  },
  "error": function(response) {
  	//CheckedConnect(30);
  	console.log(response + " - Error toggle print");
  	//$('.label_status').text('не удалось подключиться');
  	//var status = document.getElementById("status");
  	//status.innerText = "Не удалось подключиться";
                }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
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
var ConfirmPrint = function (name_file) {
    swal({
            title: "Вы уверены ?",
            text: "Данный файл будет скопирован на внутреннюю память и отправлен на печать",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#f8b32d",
            confirmButtonText: "Да, я сделаю это",
            cancelButtonText: "Нет, не хооочу",
            closeOnConfirm: true,
            closeOnCancel: true
        }, function(isConfirm){
            if (isConfirm) {
                //swal("Отправлено", "Вот ты упёртый ! Теперь жди !", "success");
                StartPrint(name_file);
                $('#maintab').click();
            } else {
                swal("Отменено", "А ты послушный :)", "error");
            }
        });
};
var StartPrint = function (name_file) {
  var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://127.0.0.1:" + ActivePort + "/api/files/local/" + decodeURI(name_file),
      "method": "POST",
      "headers": {
          "x-api-key": ActiveApi,
          "content-type": "application/json",
          "cache-control": "no-cache"
      },
      "data": '{"command": "select", "print": true}',
      "processData": false,
      "success": function(response){
          $('#progress').html('');
          $('#progress').css('width', '0%');
          GetJob();
          console.log('SUUCCCCCEEESS -', response);
          $('#status_print').text("ИДЁТ ПЕЧАТЬ...");
          },
      "error": function(response){
          console.log('ERRROrE -', response);
          swal("Ошибка", "Ошибка печати", "error");
      }

};
  $.ajax(settings).done(function (response) {
   console.log(response);
});
  console.log(name_file);
};

// Update files local and SD CARD
$('#localfiles').on('click', function () {$('#rowfiles').html('');$('#localfiles').addClass('active');$('#usbfiles').removeClass('active');GetFilesLocal("sdcard?recursive=true");});
$('#usbfiles').on('click', function () {$('#rowfiles').html('');$('#localfiles').removeClass('active');$('#usbfiles').addClass('active');GetFilesLocal("local?force=true&filter=gcode&recursive=true");});

// Get files
var GetFilesLocal = function (dd) {
    console.log('LOCAL');
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://127.0.0.1:" + ActivePort + "/api/files/" + dd,
        "method": "GET",
        "headers": {
            "x-api-key": ActiveApi,
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "success": function (response) {
            console.log(response);
            var data_html = "";
            if (response.files.length === 0){
            	if (dd === "local?force=true&filter=gcode&recursive=true"){$('#usbfiles').css('visibility', 'hidden');
            	$('#rowfiles').html('');};
            }
            else {
                for (var item in response.files) {
                    //alert();
                    data_html = data_html + "<div class='col-lg-3 col-md-3 col-sm-6 col-xs-12  file-box'><div class='file'><a onclick=\"ConfirmPrint(\'" + response.files[item].name + "\' ) \" > <div class='icon'> <i class='zmdi zmdi-file-text'></i> </div> <div class='file-name'>" + response.files[item].name + "<br> <span>Added: --------</span> </div> </a> </div> </div>";

                }
                if (dd === "local?force=true&filter=gcode&recursive=true") {
                    $('#usbfiles').css('visibility', 'visible');
                };
                if (dd === "local?force=true&filter=gcode&recursive=true") {
                	if ($('#usbfiles').hasClass('active')) {
                		$('#rowfiles').html(data_html);
					}
                };
                if (dd === "sdcard?recursive=true") {
                	if ($('#localfiles').hasClass('active')) {
                		$('#rowfiles').html(data_html);
					}
                };

            };

        }
    };
    $.ajax(settings).done(function (response) {
    console.log(response);
});};

var GetJob = function () {
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/job",
  "method": "GET",
  "headers": {
  	"x-api-key": ActiveApi,
	  "content-type": "application/json",
	  "cache-control": "no-cache"
  },
  "processData": false,
  "success": function (response) {
  	//alert('Успешно', response);
	  if (response.progress.completion) {
	      //$('#status_print').text("ИДЁТ ПЕЧАТЬ...");
          $('#progress').css('width', Math.round(response.progress.completion) + '%');
          $('#progress').html(Math.round(response.progress.completion) + '%');
          console.log(response, response.progress.completion);
          $('#file_name').text("Файл: " + response.job.file.name);
          $('#estimatedPrintTime').text("Время печати: " + moment(Number(response.job.estimatedPrintTime)).format('hh:mm:ss'));
          $('#printTime').text("Печатается: " + moment(Number(response.job.lastPrintTime)).format('hh:mm:ss'));
      };

  },
  "error": function (response) {
  	//alert('Не успешно', response);
  }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
};
/*****Connect Octoprint Serve ******/
var PrintHead = function (command) {
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

$('#UP_Z').on('click', function () {
		//alert('UP_Z' + $('#myTabs_8').find('.active').find('a').text());
		var command = '{"command": "jog", "z": ' + $('#myTabs_8').find('.active').find('a').text() + '}';
		console.log(command);
		PrintHead(command);
    });
$('#UP_Y').on('click', function () {
		//alert('UP Y' + $('#myTabs_8').find('.active').find('a').text());
		var command = '{"command": "jog", "y": ' + $('#myTabs_8').find('.active').find('a').text() + '}';
		console.log(command);
		PrintHead(command);
    });
$('#DOWN_Z').on('click', function () {
		//alert('DOWN Z' + $('#myTabs_8').find('.active').find('a').text());
		var command = '{"command": "jog", "z": -' + $('#myTabs_8').find('.active').find('a').text() + '}';
		console.log(command);
		PrintHead(command);
    });
$('#Down_Y').on('click', function () {
		//alert('DOWN Y' + $('#myTabs_8').find('.active').find('a').text());
		var command = '{"command": "jog", "y": -' + $('#myTabs_8').find('.active').find('a').text() + '}';
		console.log(command);
		PrintHead(command);
    });
$('#Home_Z').on('click', function () {
		//alert('Home Z' + $('#myTabs_8').find('.active').find('a').text());
		var command = '{"command": "home", "axes": ["z"]}';
		console.log(command);
		PrintHead(command);
    });
$('#Home_XY').on('click', function () {
		//alert('Home XY' + $('#myTabs_8').find('.active').find('a').text());
		var command = '{"command": "home", "axes": ["x", "y"]}';
		console.log(command);
		PrintHead(command);
    });
$('#Left_X').on('click', function () {
		//alert('Left X' + $('#myTabs_8').find('.active').find('a').text());
		var command = '{"command": "jog", "x": -' + $('#myTabs_8').find('.active').find('a').text() + '}';
		console.log(command);
		PrintHead(command);
    });
$('#Right_X').on('click', function () {
		//alert('Right X' + $('#myTabs_8').find('.active').find('a').text());
		var command = '{"command": "jog", "x": ' + $('#myTabs_8').find('.active').find('a').text() + '}';
		console.log(command);
		PrintHead(command);
    });

function timer(){
    var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/printer",
  "method": "GET",
  "headers": {
  	"x-api-key": ActiveApi,
	  "content-type": "application/json",
	  "cache-control": "no-cache"
  },
  "processData": false,
  "success": function(response) {
  	console.log(response);
  	//var resptxt = JSON.parse(response.responseText);
  	if (response.temperature.tool0){
  		if (response.temperature.tool0.target === 0){
  			var temptool1 = response.temperature.tool0.actual * 100 / TARGET;
  			$('#pie_chart_1').find('.percents').text(response.temperature.tool0.actual);
  			$('#pie_chart_1').data('easyPieChart').update(temptool1);
  			$('#degres_1').text('/' + response.temperature.tool0.target + '°');
  			//$('#pie_chart_1').find('.percent').text(response.temperature.tool0.actual);
  		}
  		else {
  		var temptools1 = response.temperature.tool0.actual * 100 / response.temperature.tool0.target;
  		$('#degres_1').text('/' + response.temperature.tool0.target + '°');
  		$('#pie_chart_1').find('.percents').text(response.temperature.tool0.actual);
  		$('#pie_chart_1').data('easyPieChart').update(temptools1);}


	};
  	//if (response.temperature.tool1){
  	//	if (response.temperature.tool1.target === 0){
  	//		var temptool2 = response.temperature.tool1.actual * 100 / TARGET;
  	//		$('#pie_chart_2').find('.percents').text(response.temperature.tool1.actual);
  	//		$('#pie_chart_2').data('easyPieChart').update(temptool2);
  	//		$('#degres_2').text('/' + response.temperature.tool1.target + '°');
  	//		//$('#pie_chart_2').find('.percent').text(response.temperature.tool1.actual);
  	//	}
  	//	else {
  	//	var temptools2 = response.temperature.tool1.actual * 100 / response.temperature.tool1.target;
  	//	$('#degres_2').text('/' + response.temperature.tool1.target + '°');
  	//	$('#pie_chart_2').find('.percents').text(response.temperature.tool1.actual);
  	//	$('#pie_chart_2').data('easyPieChart').update(temptools2);}
	//};
  	if (response.temperature.bed){
  		if (response.temperature.bed.target === 0){
  			var tempbed = response.temperature.bed.actual * 100 / TARGET;
  			$('#pie_chart_3').find('.percents').text(response.temperature.bed.actual);
  			$('#pie_chart_3').data('easyPieChart').update(tempbed);
  			$('#degres_3').text('/' + response.temperature.bed.target + '°');
  			//$('#pie_chart_3').find('.percent').text(response.temperature.bed.actual);
  		}
  		else {
  		var tempbeds = response.temperature.bed.actual * 100 / response.temperature.bed.target;
  		$('#degres_3').text('/' + response.temperature.bed.target + '°');
  		$('#pie_chart_3').find('.percents').text(response.temperature.bed.actual);
  		$('#pie_chart_3').data('easyPieChart').update(tempbeds);}
	};
  	//GetFilesLocal("sdcard?recursive=true");
  	GetFilesLocal("local?force=true&filter=gcode&recursive=true");
	  },
  "error": function() {
  	CheckedConnect(30);
  	Disconnected();
  	//alert("Error");
  	//var status = document.getElementById("status");
  	//status.innerText = "Не удалось подключиться";
                }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
}
var GetState = function (flag) {
	if (flag === 'false') {
		$('#pie_chart_1').data('easyPieChart').update(0);
			//$('#pie_chart_2').data('easyPieChart').update(0);
				$('#pie_chart_3').data('easyPieChart').update(0);
                clearInterval(idIntervals);
             }
             else {
		idIntervals=setInterval(function(){timer();GetJob();},2000);//опять запускается таймер
	}
  //clearInterval(idIntervals);//тут останавливаем таймер

};

//function timer(flag){
//    var intervalId = setInterval (function(){...}
//    if (flag == 'false') {
//                clearInterval(intervalId);
//             }
//};

//var GetState = function () {

//};

var Connected = function () {
	var connect = document.getElementById("connect");
  	connect.classList.add('disabled');
  	var disconnect = document.getElementById("disconnect");
  	disconnect.classList.remove('disabled');
  	//var status = document.getElementById("status");
  	//status.innerText = "подключено";
  	$('.label_status').text('подключено');
  	$('.connection_label').text('');
  	GetState();
  	//$('#pie_chart_2').data('easyPieChart').update(100);
};
/***** End Connected *****/
/***** Disconnected *****/
var Disconnected = function () {
	var connect = document.getElementById("connect");
  	connect.classList.remove('disabled');
  	var disconnect = document.getElementById("disconnect");
  	disconnect.classList.add('disabled');
  	$('.label_status').text('отключено');
  	GetState('false');
};
/***** End Disconnected *****/

/*****Connect Octoprint Serve ******/
var ConnectServ = function () {
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/connection",
  "method": "POST",
  "headers": {
  	"x-api-key": ActiveApi,
	  "content-type": "application/json",
	  "cache-control": "no-cache"
  },
  "processData": false,
  "data": '{"command": "connect"}',
  "success": function(response) {
  	//alert(response);
	  console.log(response + 'ConnectServ');
	  Connected();
	  },
  "error": function(response) {
      clearInterval(GLOBAL_TIMER);
  	CheckedConnect(5);
  	console.log(response + 'Error connect serv');
  	$('.label_status').text('не удалось подключиться');
  	//var status = document.getElementById("status");
  	//status.innerText = "Не удалось подключиться";
                }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
};
/***** Disconnect Octoprint Serve ******/
var DisconnectServ = function () {
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/connection",
  "method": "POST",
  "headers": {
    "x-api-key": ActiveApi,
    "content-type": "application/json",
	  "cache-control": "no-cache"
  },
  "processData": false,
  "data": '{"command": "disconnect"}',
  "success": function() {
  	//alert("Success");
	  Disconnected();
	  },
  "error": function() {
  	//alert("Error");
  	var status = document.getElementById("status");
  	status.innerText = "Нет соединения";
                }
};
$.ajax(settings).done(function (response) {
    console.log(response);
});
};

//$('#disconnect').bind('click', DisconnectServ());
//$('#connect').bind('click', ConnectServ());

var StartOcto = function(){
var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/connection",
  "method": "POST",
  "headers": {
    "x-api-key": ActiveApi,
    "content-type": "application/json",
    "cache-control": "no-cache"
  },
  "processData": false,
  "data": '{"command": "connect"}'
};

$.ajax(settings).done(function (response) {
  console.log(response);
  //var current = JQuery.parseJSON(response);
  //alert(response['current']['state']);
  //var msg = document.getElementById("baudrates");
  //for (var key in response['options']['baudrates']) {
    //  var newOption = new Option(response['options']['baudrates'][key], "Классика");
      //msg.appendChild(newOption);
  //}
  //msg.innerText = response['current']['state'];
  //return response;
});
};

var GetPosition = function () {
    //M306 Z0 \n G28 \n M500
    var command = '{"commands": ["M114"]}';
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": URL + "/api/printer/command",
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

var ProcessingData = function (data) {
    //console.log('============');
    var foundPos = data.indexOf('a[');
    if (~foundPos)
    {
        var strData = data.substring(foundPos+1);
        var jsonData = JSON.parse(strData)[0];
        //console.log('Совпадение есть -- >');
        //console.log(jsonData[0]);
        //-----
        var event = JSON.parse(strData, function (key, value) {

            if (key == 'event') {console.log('RINF EVENT', value['payload']['x'], value['payload']['y']); $('#coorX').text(value['payload']['x']); $('#coorY').text(value['payload']['y']); $('#coorX').text(value['payload']['Z']); return value['payload'];}
            if (key == 'current') {console.log('PAYLOAD ->', value['current'])};
            return value
        });
        console.log("!!!!_____-=", event[0].event);
        console.log("!!!!_____-=", event[0].current);
        //if (jsonData[0]['event']['payload']){
         //   console.log('!!!! - ', jsonData[0]['event']['payload']);
        //}
        //-----
        console.log(data);
    };
    //console.log(event);
};

var IsConnectServer = function () {
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": URL + "/api/connection",
        "method": "GET",
        "headers": {
            "x-api-key": ActiveApi,
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "success": function () {
            //"ws://127.0.0.1:5000/sockjs/627/mvy2qfdj/websocket"
            var socket = new WebSocket("ws://0.0.0.0:80/sockjs/627/mvy2qfdj/websocket");
            var socket2 = new WebSocket("ws://0.0.0.0:5000/sockjs/627/mvy2qfdj/websocket");
            alert(socket);
            alert(socket2);
            socket.onopen = function() { alert("Connection opened...") };
            socket.onmessage = function(event) {
                ProcessingData(event.data);
                GetPosition();
                //alert('Active connection');
                //alert(event);
            };

        },
        "error": function () {
            $('#status_print').text("ПРОБЛЕМА С СЕРВЕРОМ...");
        },
    };
    $.ajax(settings).done(function (response) {console.log(response)});
};

var GetStatePrinter = function () {
	var settings = {
  "async": true,
  "crossDomain": true,
  "url": "http://127.0.0.1:" + ActivePort + "/api/connection",
  "method": "GET",
  "headers": {
    "x-api-key": ActiveApi,
    "content-type": "application/json",
    "cache-control": "no-cache"
  },
  "processData": false,
		"success": function (msg) {
      IsConnectServer();
			console.log(msg.current.state + 'MSG SUC');
			if (msg.current.state === 'Closed' || msg.current.state === 'Offline' ){
				ConnectServ();
				Disconnected();
				//InitialServe('false');
			};
			if (msg.current.state === 'Operational') {
			    Connected();
			    GetPosition();
            }
        },
		"error": function (msg) {
			console.log(msg + 'MSG ERR');
			CheckedConnect(5);
			$('.label_status').text('не удалось подключиться');
        },
};

$.ajax(settings).done(function (response) {
  console.log(response.current.state);
});
};

var ShowTimer = function (iter, idIntervall) {
$('.connection_label').text('повтор через: ' + iter + 'с');
if (iter ===0){console.log(iter, idIntervall);GetStatePrinter();clearInterval(idIntervall);};
//$('#connect').on('click', function () {
//    alert('AAAA-RABOTAET');
//});

	 	//if (iter === 0){console.log(iter, idIntervall, 'sad');clearInterval(idIntervall);};
};
var GLOBAL_TIMER;
var CheckedConnect = function (i) {
console.log('GLOBAL TIMER', i);
//GetStatePrinter();
	//var i = 30;
	 //while (i > 0){
    //clearInterval(idIntervall);
	 var idIntervall=setInterval(function(){
	 	ShowTimer(i, idIntervall);
	 	i--;

	 },1000);
	 GLOBAL_TIMER = idIntervall;
	 //return idIntervall;
	 //i--;
	 //console.log(i);
	 //};
	 //i--;
	 //if (i < 0){clearInterval(idIntervals);InitialServe('false');};
	 //if (i === 0){clearInterval(idIntervals);InitialServe('false');};

	//alert(args);
};

//var InitialServe = function () {
//if (error === 'false') {
// console.log('TIMER STOP');
 //               clearInterval(idIntervals);

   //          }
            // else {
//	console.log('START MAIN TIMER');
//	var tik = 32000;
//	setTimeout(function(){CheckedConnect(tik/1000-2);},tik);
//};
/********END FUNC ******/
/*****Ready function start*****/
$(document).ready(function(){
	jetson();
	//ConnectServ();
	//$('#disconnect').onClick(DisconnectServ());
	//StartOcto();
	$('.preloader-it > .la-anim-1').addClass('la-animate');
	$('#pie_chart_1').data('easyPieChart').update(0);
	$('#degres_1').text('/' + TARGET + '°');
	//$('#pie_chart_2').data('easyPieChart').update(0);
	//$('#degres_2').text('/' + TARGET + '°');
	$('#pie_chart_3').data('easyPieChart').update(0);
	$('#degres_3').text('/' + TARGET + '°');
	//$('#progress').css('width',  '0%');
	$('#progress').html('');
	//$('#pie_chart_34').data('easyPieChart').update(0);
	//$('#degres_34').text('/' + TARGET + '°');
	//InitialServe();
	GetStatePrinter();
	//GetFilesLocal();
    //ConnectServ();
	GetFilesLocal("sdcard?recursive=true");
  	GetFilesLocal("local?force=true&filter=gcode&recursive=true");
});
/*****Ready function end*****/

/*****Load function start*****/
$(window).on("load", function() {
	$(".preloader-it").delay(500).fadeOut("slow");
	/*Progress Bar Animation*/
	var progressAnim = $('.progress-anim');
	if( progressAnim.length > 0 ){
		for(var i = 0; i < progressAnim.length; i++){
			var $this = $(progressAnim[i]);
			$this.waypoint(function() {
			var progressBar = $(".progress-anim .progress-bar");
			for(var i = 0; i < progressBar.length; i++){
				$this = $(progressBar[i]);
				$this.css("width", $this.attr("aria-valuenow") + "%");
			}
			}, {
			  triggerOnce: true,
			  offset: 'bottom-in-view'
			});
		}
	};
    $('ul.menu-main').on('click', 'li:not(.active)', function() {
		$(this)
			.addClass('active').siblings().removeClass('active')
			.closest('div.tabs').find('div.tabs__content').removeClass('active').eq($(this).index()).addClass('active');
	});

	var tabIndex = window.location.hash.replace('#tab','')-1;
	if (tabIndex != -1) $('ul.menu-main li').eq(tabIndex).click();

	$('a[href*=#tab]').click(function() {
		var tabIndex = $(this).attr('href').replace(/(.*)#tab/, '')-1;
		$('ul.menu-main li').eq(tabIndex).click();
	});

});
/*****Load function* end*****/

/***** Full height function start *****/
var setHeightWidth = function () {
	var height = $(window).height();
	var width = $(window).width();
	$('.full-height').css('height', (height));
	$('.page-wrapper').css('min-height', (height));

	/*Right Sidebar Scroll Start*/
	if(width<=1007){
		$('#chat_list_scroll').css('height', (height - 270));
		$('.fixed-sidebar-right .chat-content').css('height', (height - 279));
		$('.fixed-sidebar-right .set-height-wrap').css('height', (height - 219));

	}
	else {
		$('#chat_list_scroll').css('height', (height - 204));
		$('.fixed-sidebar-right .chat-content').css('height', (height - 213));
		$('.fixed-sidebar-right .set-height-wrap').css('height', (height - 153));
	}
	/*Right Sidebar Scroll End*/

	/*Vertical Tab Height Cal Start*/
	var verticalTab = $(".vertical-tab");
	if( verticalTab.length > 0 ){
		for(var i = 0; i < verticalTab.length; i++){
			var $this =$(verticalTab[i]);
			$this.find('ul.nav').css(
			  'min-height', ''
			);
			$this.find('.tab-content').css(
			  'min-height', ''
			);
			height = $this.find('ul.ver-nav-tab').height();
			$this.find('ul.nav').css(
			  'min-height', height + 40
			);
			$this.find('.tab-content').css(
			  'min-height', height + 40
			);
		}
	}
	/*Vertical Tab Height Cal End*/
};
/***** Full height function end *****/

/***** jetson function start *****/
var $wrapper = $(".wrapper");
var jetson = function(){

	/*Counter Animation*/
	var counterAnim = $('.counter-anim');
	if( counterAnim.length > 0 ){
		counterAnim.counterUp({ delay: 10,
        time: 1000});
	}

	/*Tooltip*/
	if( $('[data-toggle="tooltip"]').length > 0 )
		$('[data-toggle="tooltip"]').tooltip();

	/*Popover*/
	if( $('[data-toggle="popover"]').length > 0 )
		$('[data-toggle="popover"]').popover()


	/*Sidebar Collapse Animation*/
	var sidebarNavCollapse = $('.fixed-sidebar-left .side-nav  li .collapse');
	var sidebarNavAnchor = '.fixed-sidebar-left .side-nav  li a';
	$(document).on("click",sidebarNavAnchor,function (e) {
		if ($(this).attr('aria-expanded') === "false")
				$(this).blur();
		$(sidebarNavCollapse).not($(this).parent().parent()).collapse('hide');
	});

	/*Panel Remove*/
	$(document).on('click', '.close-panel', function (e) {
		var effect = $(this).data('effect');
			$(this).closest('.panel')[effect]();
		return false;
	});

	/*Accordion js*/
		$(document).on('show.bs.collapse', '.panel-collapse', function (e) {
		$(this).siblings('.panel-heading').addClass('activestate');
	});

	$(document).on('hide.bs.collapse', '.panel-collapse', function (e) {
		$(this).siblings('.panel-heading').removeClass('activestate');
	});

	/*Sidebar Navigation*/
	$(document).on('click', '#toggle_nav_btn,#open_right_sidebar,#setting_panel_btn', function (e) {
		$(".dropdown.open > .dropdown-toggle").dropdown("toggle");
		return false;
	});
	$(document).on('click', '#toggle_nav_btn', function (e) {
		$wrapper.removeClass('open-right-sidebar open-setting-panel').toggleClass('slide-nav-toggle');
		return false;
	});

	$(document).on('click', '#open_right_sidebar', function (e) {
		$wrapper.toggleClass('open-right-sidebar').removeClass('open-setting-panel');
		return false;

	});

	$(document).on('click','.product-carousel .owl-nav',function(e){
		return false;
	});

	$(document).on('click', 'body', function (e) {
		if($(e.target).closest('.fixed-sidebar-right,.setting-panel').length > 0) {
			return;
		}
		$('body > .wrapper').removeClass('open-right-sidebar open-setting-panel');
		return;
	});

	$(document).on('show.bs.dropdown', '.nav.navbar-right.top-nav .dropdown', function (e) {
		$wrapper.removeClass('open-right-sidebar open-setting-panel');
		return;
	});

	$(document).on('click', '#setting_panel_btn', function (e) {
		$wrapper.toggleClass('open-setting-panel').removeClass('open-right-sidebar');
		return false;
	});
	$(document).on('click', '#toggle_mobile_nav', function (e) {
		$wrapper.toggleClass('mobile-nav-open').removeClass('open-right-sidebar');
		return;
	});


	$(document).on("mouseenter mouseleave",".wrapper > .fixed-sidebar-left", function(e) {
		if (e.type == "mouseenter") {
			$wrapper.addClass("sidebar-hover");
		}
		else {
			$wrapper.removeClass("sidebar-hover");
		}
		return false;
	});

	$(document).on("mouseenter mouseleave",".wrapper > .setting-panel", function(e) {
		if (e.type == "mouseenter") {
			$wrapper.addClass("no-transition");
		}
		else {
			$wrapper.removeClass("no-transition");
		}
		return false;
	});

	/*Todo*/
	var random = Math.random();
	$(document).on("keypress","#add_todo",function (e) {
		if ((e.which == 13)&&(!$(this).val().length == 0))  {
				$('<li class="todo-item"><div class="checkbox checkbox-success"><input type="checkbox" id="checkbox'+random+'"/><label for="checkbox'+random+'">' + $('.new-todo input').val() + '</label></div></li><li><hr class="light-grey-hr"/></li>').insertAfter(".todo-list li:last-child");
				$('.new-todo input').val('');
		} else if(e.which == 13) {
			alert('Please type somthing!');
		}
		return;
	});

	/*Chat*/
	$(document).on("keypress","#input_msg_send",function (e) {
		if ((e.which == 13)&&(!$(this).val().length == 0)) {
			$('<li class="self mb-10"><div class="self-msg-wrap"><div class="msg block pull-right">' + $(this).val() + '<div class="msg-per-detail mt-5"><span class="msg-time txt-grey">3:30 pm</span></div></div></div><div class="clearfix"></div></li>').insertAfter(".fixed-sidebar-right .chat-content  ul li:last-child");
			$(this).val('');
		} else if(e.which == 13) {
			alert('Please type somthing!');
		}
		return;
	});
	$(document).on("keypress","#input_msg_send_widget",function (e) {
		if ((e.which == 13)&&(!$(this).val().length == 0)) {
			$('<li class="self mb-10"><div class="self-msg-wrap"><div class="msg block pull-right">' + $(this).val() + '<div class="msg-per-detail mt-5"><span class="msg-time txt-grey">3:30 pm</span></div></div></div><div class="clearfix"></div></li>').insertAfter(".chat-for-widgets .chat-content  ul li:last-child");
			$(this).val('');
		} else if(e.which == 13) {
			alert('Please type somthing!');
		}
		return;
	});
	$(document).on("keypress","#input_msg_send_chatapp",function (e) {
		if ((e.which == 13)&&(!$(this).val().length == 0)) {
			$('<li class="self mb-10"><div class="self-msg-wrap"><div class="msg block pull-right">' + $(this).val() + '<div class="msg-per-detail mt-5"><span class="msg-time txt-grey">3:30 pm</span></div></div></div><div class="clearfix"></div></li>').insertAfter(".chat-for-widgets-1 .chat-content  ul li:last-child");
			$(this).val('');
		} else if(e.which == 13) {
			alert('Please type asomthing!');
		}
		return;
	});

	$(document).on("click",".fixed-sidebar-right .chat-cmplt-wrap .chat-data",function (e) {
		$(".fixed-sidebar-right .chat-cmplt-wrap").addClass('chat-box-slide');
		return false;
	});
	$(document).on("click",".fixed-sidebar-right #goto_back",function (e) {
		$(".fixed-sidebar-right .chat-cmplt-wrap").removeClass('chat-box-slide');
		return false;
	});

	/*Chat for Widgets*/
	$(document).on("click",".chat-for-widgets.chat-cmplt-wrap .chat-data",function (e) {
		$(".chat-for-widgets.chat-cmplt-wrap").addClass('chat-box-slide');
		return false;
	});
	$(document).on("click","#goto_back_widget",function (e) {
		$(".chat-for-widgets.chat-cmplt-wrap").removeClass('chat-box-slide');
		return false;
	});
	/*Horizontal Nav*/
	$(document).on("show.bs.collapse",".top-fixed-nav .fixed-sidebar-left .side-nav > li > ul",function (e) {
		e.preventDefault();
	});

	/*Slimscroll*/
	$('.nicescroll-bar').slimscroll({height:'100%',color: '#878787', disableFadeOut : true,borderRadius:0,size:'4px',alwaysVisible:false});
	$('.message-nicescroll-bar').slimscroll({height:'229px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.message-box-nicescroll-bar').slimscroll({height:'350px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.product-nicescroll-bar').slimscroll({height:'346px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.app-nicescroll-bar').slimscroll({height:'162px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.todo-box-nicescroll-bar').slimscroll({height:'310px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.users-nicescroll-bar').slimscroll({height:'370px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.users-chat-nicescroll-bar').slimscroll({height:'257px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.chatapp-nicescroll-bar').slimscroll({height:'543px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});
	$('.chatapp-chat-nicescroll-bar').slimscroll({height:'483px',size: '4px',color: '#878787',disableFadeOut : true,borderRadius:0});

	/*Product carousel*/
	if( $('.product-carousel').length > 0 )
	var $owl = $('.product-carousel').owlCarousel({
		loop:true,
		margin:15,
		nav:true,
		navText: ["<i class='zmdi zmdi-chevron-left'></i>","<i class='zmdi zmdi-chevron-right'></i>"],
		dots:false,
		autoplay:true,
		responsive:{
			0:{
				items:1
			},
			400:{
				items:2
			},
			767:{
				items:3
				},
			1399:{
				items:4
			}
		}
	});

	/*Refresh Init Js*/
	var refreshMe = '.refresh';
	$(document).on("click",refreshMe,function (e) {
		var panelToRefresh = $(this).closest('.panel').find('.refresh-container');
		var dataToRefresh = $(this).closest('.panel').find('.panel-wrapper');
		var loadingAnim = panelToRefresh.find('.la-anim-1');
		panelToRefresh.show();
		setTimeout(function(){
			loadingAnim.addClass('la-animate');
		},100);
		function started(){} //function before timeout
		setTimeout(function(){
			function completed(){} //function after timeout
			panelToRefresh.fadeOut(800);
			setTimeout(function(){
				loadingAnim.removeClass('la-animate');
			},800);
		},1500);
		  return false;
	});

	/*Fullscreen Init Js*/
	$(document).on("click",".full-screen",function (e) {
		$(this).parents('.panel').toggleClass('fullscreen');
		$(window).trigger('resize');
		return false;
	});

	/*Nav Tab Responsive Js*/
	$(document).on('show.bs.tab', '.nav-tabs-responsive [data-toggle="tab"]', function(e) {
		var $target = $(e.target);
		var $tabs = $target.closest('.nav-tabs-responsive');
		var $current = $target.closest('li');
		var $parent = $current.closest('li.dropdown');
			$current = $parent.length > 0 ? $parent : $current;
		var $next = $current.next();
		var $prev = $current.prev();
		$tabs.find('>li').removeClass('next prev');
		$prev.addClass('prev');
		$next.addClass('next');
		return;
	});
};
/***** jetson function end *****/

/***** Chat App function Start *****/
var chatAppTarget = $('.chat-for-widgets-1.chat-cmplt-wrap');
var chatApp = function() {
	$(document).on("click",".chat-for-widgets-1.chat-cmplt-wrap .chat-data",function (e) {
		var width = $(window).width();
		if(width<=1007) {
			chatAppTarget.addClass('chat-box-slide');
		}
		return false;
	});
	$(document).on("click","#goto_back_widget_1",function (e) {
		var width = $(window).width();
		if(width<=1007) {
			chatAppTarget.removeClass('chat-box-slide');
		}
		return false;
	});
};
/***** Chat App function End *****/

var boxLayout = function() {
	if((!$wrapper.hasClass("rtl-layout"))&&($wrapper.hasClass("box-layout")))
		$(".box-layout .fixed-sidebar-right").css({right: $wrapper.offset().left + 300});
		else if($wrapper.hasClass("box-layout rtl-layout"))
			$(".box-layout .fixed-sidebar-right").css({left: $wrapper.offset().left});
}
boxLayout();

/***** Resize function start *****/
$(window).on("resize", function () {
	setHeightWidth();
	boxLayout();
	chatApp();
}).resize();
/***** Resize function end *****/

