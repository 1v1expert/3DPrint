/* Socket handler module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/

var is_connect_server = false, is_connect_printer = false;
var socket = null;
var Show_connection_status = function (msg, resp, status) {
    "use strict";
    $('.label_status').text(msg);
    if (resp === undefined) {
        console.log(status, 'MSG: ' + msg);
    }
    else {
        console.log(status, 'MSG: ' + msg, 'Response: ',  resp);
    }
};
var AuthSocket = function (name, session) {
    "use strict";
    console.log(name, session);
    setTimeout(function() {
        OctoPrint.socket.sendAuth(name, session);
        }, 1000);
};
var ConnectOctoprint = function () {
    "use strict";
    OctoPrint.options.baseurl = DATA.config.BaseUrl;
    OctoPrint.options.apikey = DATA.config.Apikey;
    OctoPrint.browser.login(DATA.config.Login, DATA.config.Password, true)
        .done(function(response) {
            Show_connection_status('Успешно пройдена инициализация', response, 'success');
            AuthSocket(response.name, response.session);
            OctoPrint.socket.connect();
            OctoPrint.socket.onMessage("*", function(message) {
                is_connect_server = true;
                ProcessingData(message);
            });

        })
        .error(function (response) {
            Show_connection_status('Не запущено ядро приложения ', response, 'error');
            setTimeout(function() {
                ConnectOctoprint();
                }, 2000);
        });
};

