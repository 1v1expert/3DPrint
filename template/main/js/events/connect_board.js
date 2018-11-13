/* Connect board module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/

var SuccessConect = function () {
    "use strict";
    window.setTimeout(function () {
        $.toast({
            heading: 'Подключение к принтеру',
            text: 'успешно',
            position: 'bottom-left',
            loaderBg: '#f8b32d',
            icon: 'success',
            hideAfter: 3500,
            stack: 6
        });
    }, 30);
};

var PrinterState = function (state) {
    "use strict";
    $('#status_printt').text(state);
    window.setTimeout(function () {
        $.toast().reset('all');
        $.toast({
            heading: 'Состояние:',
            text: state,
            position: 'bottom-left',
            loaderBg: '#f8b32d',
            icon: 'success',
            hideAfter: 3500,
            stack: 7
        });
    }, 30);
};
var MessageOutput = function (msg) {
    "use strict";
    window.setTimeout(function () {
        $.toast().reset('all');
        $.toast({
            heading: 'Мессаджи:',
            text: msg,
            position: 'bottom-right',
            loaderBg: '#f8b32d',
            icon: 'info',
            hideAfter: 3500,
            stack: 7
        });
    }, 30);
};
