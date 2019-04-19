/* Views module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/
"use strict";
/********/
/*Offset on Z coordinate module */
var NewZ = $('#NewZ');
function set_value_position(value) {
    $('#currentZ').text(value);
    NewZ.text(value);
}

$('#offsetZ').on('click', function () {
    set_value_position(Apps._offset_position._Z);
    Apps.PlayCommand(Apps._settings.Definition.OffsetZ.Command);
    setTimeout(function(){set_value_position(Apps._offset_position._Z);}, 2000);
});
$('#down_to_Z').on('click', function () {
    if (NewZ.text()) {
        NewZ.text(Math.round((+NewZ.text() - Apps._settings.Definition.OffsetZ.StepChange) * 100) / 100);
    }
});
$('#up_to_Z').on('click', function () {
    if (NewZ.text()) {
        NewZ.text(Math.round((+NewZ.text() + Apps._settings.Definition.OffsetZ.StepChange) * 100) / 100);
    }
});
$('#set_offset_z').on('click', function () {
    if (NewZ.text()) {
        var command = Apps._settings.Definition.OffsetZ.Command + ' Z' + NewZ.text();
        Apps.PlayCommand(command);
    }
});
/* End module offset on Z coordinate module */
/* Manage main windows */
$('#manage_print').on('click', function () {
    if (Apps.Printer._is_connect_printer) {
        GetPosition();
    }
});
/* End manage */
$('#connect').on('click', function () {
   Apps.Printer.ConnectPrinter();
});
$('#disconnect').on('click', function () {
   Apps.Printer.DisconnectPrinter();
});
$('#localfiles').on('click', function () {$('#rowfiles').html('');$('#localfiles').addClass('active');$('#usbfiles').removeClass('active');GetFiles('sdcard?force=true');});
//GetFiles("sdcard?recursive=true");});
$('#usbfiles').on('click', function () {$('#rowfiles').html('');$('#localfiles').removeClass('active');$('#usbfiles').addClass('active');
GetFiles('local?force=true');});
//GetFiles("local?force=true&filter=gcode&recursive=true");});
$('#UP_Z').on('click', function () {
    //alert('UP_Z' + $('#myTabs_8').find('.active').find('a').text());
    var command = '{"command": "jog", "z": ' + $('#myTabs_8').find('.active').find('a').text() + '}';
    PrintHead(command);
    setTimeout(function () {
        GetPosition();
    }, 1000);
});
$('#UP_Y').on('click', function () {
    var command = '{"command": "jog", "y": ' + $('#myTabs_8').find('.active').find('a').text() + '}';
    PrintHead(command);
    setTimeout(function () {
        GetPosition();
    }, 1000);
});
$('#DOWN_Z').on('click', function () {
    var command = '{"command": "jog", "z": -' + $('#myTabs_8').find('.active').find('a').text() + '}';
    PrintHead(command);
    setTimeout(function () {
        GetPosition();
    }, 1000);
});
$('#Down_Y').on('click', function () {
    var command = '{"command": "jog", "y": -' + $('#myTabs_8').find('.active').find('a').text() + '}';
    PrintHead(command);
    setTimeout(function () {
        GetPosition();
    }, 1000);
});
$('#Home_Z').on('click', function () {
    var command = '{"command": "home", "axes": ["z"]}';
    PrintHead(command);
    setTimeout(function () {
        GetPosition();
    }, 1000);
});
$('#Home_XY').on('click', function () {
    var command = '{"command": "home", "axes": ["x", "y"]}';
    PrintHead(command);
    setTimeout(function () {
        GetPosition();
    }, 1000);
});
$('#Left_X').on('click', function () {
    var command = '{"command": "jog", "x": -' + $('#myTabs_8').find('.active').find('a').text() + '}';
    PrintHead(command);
    setTimeout(function () {
        GetPosition();
    }, 1000);
});
$('#Right_X').on('click', function () {
    var command = '{"command": "jog", "x": ' + $('#myTabs_8').find('.active').find('a').text() + '}';
    PrintHead(command);
    setTimeout(function () {
        GetPosition();
    }, 1000);
});
$('#up_t_tool').on('click', function () {
    var t = $('#t_tool').text();
    var c_t = +t;
    $('#t_tool').text(c_t-1);
});

$('#down_t_tool').on('click', function () {
    var t = $('#t_tool').text();
    var c_t = +t;
    $('#t_tool').text(c_t+1);
});

$('#up_t_board').on('click', function () {
    var t = $('#t_board').text();
    var c_t = +t;
    $('#t_board').text(c_t-1);
});

$('#down_t_board').on('click', function () {
    var t = $('#t_board').text();
    var c_t = +t;
    $('#t_board').text(c_t+1);
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
$('#restart_touchui').on('click', function () {
    Restart_touchui();
});
/********/
$('#extract').on('click', function () {
    Apps.PlayCommand(["M109 S200", "G91", "G1 E15 F200", "G1 E-80 F200", "G1 E-390 F4000"]);
    //Extrude("tool0", String(Definition.Extrude));

});
$('#download').on('click', function () {
    Apps.PlayCommand(["M109 S230", "G91", "G1 E30 F150", "G1 E280 F700", "G1 E100 F150"]);
    //Extrude("tool0", -String(Definition.Extrude));
});
$('#extrude').on('click', function () {
    OctoPrint.printer.extrude(5.0)
    .done(function(response) {
        console.log(response);
    });
    //Extrude("tool1", String(Definition.Extrude));
});
$('#retruct').on('click', function () {
    OctoPrint.printer.extrude(-5.0)
    .done(function(response) {
        console.log(response);
    });
    //Extrude("tool1", -String(Definition.Extrude));
});
/*********/
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
