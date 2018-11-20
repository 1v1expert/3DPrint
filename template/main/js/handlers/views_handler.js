/* Views module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/
"use strict";
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
