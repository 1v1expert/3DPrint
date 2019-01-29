/* Socket handler module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/
"use strict";
var is_connect_server = false, is_connect_printer = false;
var socket = null;
var Apps = {
    PlayCommand: function (command) {
        OctoPrint.control.sendGcode(command);
    },
    init: function () {
        for (var i in DATA.buttons.General) {
            var command = DATA.buttons.General[i].command;
            $("#system_commands").append('<li><a onclick="Apps.PlayCommand(\'' + command + '\')">' + DATA.buttons.General[i].name + '</a></li>');
        }
    },
    Printer:
        {
            _state: "",
            ConnectPrinter: function () {
                //this._state_printer = "connected";
                OctoPrint.connection.connect();
            },
            DisconnectPrinter: function () {
                //this._state_printer = "disconnected";
                OctoPrint.connection.disconnect();
            },
            _is_connect_printer: null,
            _is_connect_printer_octo: null
        },
    _position:
        {
            X: null,
            Y: null,
            Z: null,
            E: null,
            update: function (value) {
                this.X = value.payload.x;
                this.Y = value.payload.y;
                this.Z = value.payload.z;
                this.E = value.payload.e;
                this.view();
            },
            view: function () {
                $('#coorX').text(this.X);
                $('#coorY').text(this.Y);
                $('#coorZ').text(this.Z);
                $('#coorE').text(this.E);
            }

        },
    socket: null,
    is_connect_server: false,
    is_connect_printer: false,
    logs:
        {
            array: "",
            update: function (data) {
                if (this.array.length > 8000) { this.array = this.array.substr(this.array.length - 5000); }
                for (var ind in data.logs) {
                    this.array += data.logs[ind] + '\n';
                }
                this.refresh();
            },
            refresh: function () {
                $('#message-text')
                    .text(this.array)
                    .animate({scrollTop: $('#message-text')[0].selectionStart}, "slow");
            }
        }
};
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
function AuthSocket(name, session) {
    "use strict";
    console.log(name, session);
    setTimeout(function() {
        OctoPrint.socket.sendAuth(name, session);
        }, 1000);
}
function ConnectOctoprint() {
    OctoPrint.options.baseurl = DATA.config.BaseUrl;
    OctoPrint.options.apikey = DATA.config.Apikey;
    OctoPrint.browser.login(DATA.config.Login, DATA.config.Password, true)
        .done(function(response) {
            Show_connection_status('Успешно пройдена инициализация', response, 'success');
            AuthSocket(response.name, response.session);
            OctoPrint.socket.connect();
            //Fix todo: Connect witch Printer offline
            Apps.Printer.ConnectPrinter();
            //ConnectPrinter();
            OctoPrint.socket.onMessage("*", function(message) {
                App.is_connect_server = true;
                ProcessingData(message);
            });

        })
        .error(function (response) {
            Show_connection_status('Не запущено ядро приложения ', response, 'error');
            setTimeout(function() {
                ConnectOctoprint();
                }, 2000);
        });
}

