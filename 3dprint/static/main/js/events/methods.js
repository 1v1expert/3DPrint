/* Main methods module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/
var StartPrint = function (name_file) {
    "use strict";
    console.log(name_file);
};
var GetFiles = function (url) {
    "use strict";
    var data_html = "";
    OctoPrint.files.listForLocation('local', true)
        .done(function(response) {
            console.log("### Files:");
            _.each(response.files, function(entry) {
                console.log(entry);
                if (entry.children) {
                    if (entry.children.length > 0) {
                        for (var children in entry.children) {
                            data_html = data_html + "<div class='col-lg-3 col-md-3 col-sm-12 col-xs-12  file-box'><div class='file'><a onclick=\"ConfirmPrint(\'" + children.name + "\' ) \" > <div class='icon'> <i class='zmdi zmdi-file-text'></i> </div> <div class='file-name'>" + children.display + "<br> <span>Доб: " + children.date + "</span> </div> </a> </div> </div>";
                        }
                    }
                }
                else {
                    data_html = data_html + "<div class='col-lg-3 col-md-3 col-sm-12 col-xs-12  file-box'><div class='file'><a onclick=\"ConfirmPrint(\'" + entry.name + "\' ) \" > <div class='icon'> <i class='zmdi zmdi-file-text'></i> </div> <div class='file-name'>" + entry.display + "<br> <span>Доб: " + entry.date + "</span> </div> </a> </div> </div>";
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
