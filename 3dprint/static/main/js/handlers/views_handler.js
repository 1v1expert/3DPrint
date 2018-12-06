/* Views module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/
"use strict";
/********/
$('#localfiles').on('click', function () {$('#rowfiles').html('');$('#localfiles').addClass('active');$('#usbfiles').removeClass('active');GetFiles("sdcard?recursive=true");});
$('#usbfiles').on('click', function () {$('#rowfiles').html('');$('#localfiles').removeClass('active');$('#usbfiles').addClass('active');GetFiles("local?force=true&filter=gcode&recursive=true");});
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
/********/
$('#extrude_1').on('click', function () {
    Extrude("tool0", String(Definition.Extrude));
}
);
$('#retruct_1').on('click', function () {
    Extrude("tool0", -String(Definition.Extrude));
});
$('#extrude_2').on('click', function () {
    Extrude("tool1", String(Definition.Extrude));
});
$('#retruct_2').on('click', function () {
    Extrude("tool1", -String(Definition.Extrude));
});
$('#PLA').on('click', function () {
    SetTemperature_bed(String(Temp.PLA.Bed));
    SetTemperature_tool(String(Temp.PLA.Tool));
});
$('#ABS').on('click', function () {
    SetTemperature_bed(String(Temp.ABS.Bed));
    SetTemperature_tool(String(Temp.ABS.Tool));
});
$('#dpauseprint_1').on('click', function () {
    TrigeredPrint();
});
$('#stopprint').on('click', function () {
    Stopprint();
});
$('#pauseprint').on('click', function () {
   SystemTrigeredPrint();
});
