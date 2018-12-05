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
