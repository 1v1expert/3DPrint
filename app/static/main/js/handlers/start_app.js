/* Socket handler module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/
"use strict";
var is_connect_server = false, is_connect_printer = false;
var socket = null;
var def_settings = DATA || {
    "CONFIG": {
        "BaseUrl": "http://localhost:5000",
        "Login": "vladdos",
        "Password": "@WSX2wsx123",
        "Apikey": "5C761F424E5E46EE934DE9F683609B66"
    },
    "translate_state": {
        "Operational": "Готов к печати",
        "Printing": "Идёт печать",
        "Paused": "Печать приостановлена",
        "Pausing": "В режиме паузы",
        "Error": "Ошибка",
        "Cancelling": "Печать отменена",
        "Offline": "Принтер отключен",
        "Printing from SD": "Печать с SD карты"
    },
    "Definition": {
        "MainTool": "tool0",
        "OffsetZ": {
            "StepChange": 0.05,
            "Command": "M206"
        },
        "Extrude": 5,
        "Target": 300
    },
    "Temp": {
        "PLA": {"Bed": 70, "Tool": 200},
        "ABS": {"Bed": 70, "Tool": 200},
        "Default": {"Bed": 72, "Tool": 201}
    },
    "buttons":
        {
            "OnPause": "M600",
            "CancPause": "M601",
            "OffsetZ": "M206",
            "General": [],
            "Aditional": []
        }
};
var Apps = {
    init: function () {
        // Including buttons from configuration
        for (var i in DATA.buttons.General) {
            var command = DATA.buttons.General[i].command;
            $("#system_commands").append('<li><a onclick="Apps.PlayCommand(\'' + command + '\')">' +
                DATA.buttons.General[i].name + '</a></li>');
        }
        Apps.Printer.Tool._active_tool = Apps._settings.Definition.MainTool;
        // End filling
    },
    PlayCommand: function (command) {
        OctoPrint.control.sendGcode(command);
    },
    _settings: def_settings,
    Printer:
        {
            MonitorState: function (state) {
                switch (state){
                    case 'Operational':
                        this._state = state;
                        this._rus_state = Apps._settings.translate_state[state];
                        this._is_connect_printer = true;
                        //this._is_connect_printer_octo = true;
                        break;
                    case 'Offline':
                        this._state = state;
                        this._rus_state = Apps._settings.translate_state[state];
                        this._is_connect_printer = false;
                        break;
                    default:
                        console.log('Untracked state: ', state);
                }
            },
            Tool: {
                _active_tool: "",
                changeTool: function (tool) {
                    OctoPrint.printer.selectTool(tool)
                        .done(function (response) {
                            $('#nozzle').text(tool);
                            this._active_tool = tool;
                            console.log(response);
                        })
                        .error(function (response) {
                            console.log(response);
                        });
                    //console.log(tool);
                }
            },

            _state: "",
            _rus_state: "",
            _is_pause: false,
            Switch_pause: function () {
                this._is_pause = !this._is_pause;
                var command = Apps._settings.buttons.OnPause;
                if (Apps.Printer._state === ('Pausing' || 'Paused')) {
                    this._is_pause = false;
                    //command = Apps._settings.buttons.CancPause;
                }


                if (this._is_pause){
                    $('#iconpause2').text(' Продолжить');
                    //$('#iconpause').text(' Продолжить#1');
                }
                else {
                    $('#iconpause2').text(' Пауза');
                    //$('#iconpause').text(' Пауза#1');
                    command = Apps._settings.buttons.CancPause;
                }
                Apps.PlayCommand(command);
            },
            ConnectPrinter: function () {
                //this._state_printer = "connected";
                ConnectOctoprint();
                //OctoPrint.connection.connect();
            },
            DisconnectPrinter: function () {
                //this._state_printer = "disconnected";
                OctoPrint.connection.disconnect();
            },
            _is_connect_printer: false,
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
    _offset_position:
        {
            _Z: null,
            update: function (value) {
                for (var key in value.payload.outputs) {
                    this._Z = +value.payload.outputs[key];
                    //console.log('Offset_update - ', value);
                }
            }
        },
    socket: null,
    is_connect_server: false,
    //is_connect_printer: false,
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
    $('.label_status').text(msg);
    if (resp === undefined) {
        console.log(status, 'MSG: ' + msg);
    }
    else {
        console.log(status, 'MSG: ' + msg, 'Response: ', resp);
    }
};

function AuthSocket(name, session) {
    setTimeout(function () {
        OctoPrint.socket.sendAuth(name, session);
    }, 1000);
}
function ConnectOctoprint() {
    OctoPrint.options.baseurl = DATA.config.BaseUrl;
    OctoPrint.options.apikey = DATA.config.Apikey;
    OctoPrint.browser.login(DATA.config.Login, DATA.config.Password, true)
        .done(function(response) {
            OctoPrint.connection.connect();
            Show_connection_status('Успешно пройдена инициализация', response, 'success');
            AuthSocket(response.name, response.session);
            OctoPrint.socket.connect();
            //Fix todo: Connect witch Printer offline
            OctoPrint.connection.getSettings().done(function(response){
                HandlerState(response.current);
                console.log(response.current.state);
            });
            //Apps.Printer.ConnectPrinter();
            //ConnectPrinter();
            OctoPrint.socket.onMessage("*", function(message) {
                Apps.is_connect_server = true;
                ProcessingData(message);
            });

        })
        .error(function (response) {
            Apps.is_connect_server = false;
            Show_connection_status('Не запущено ядро приложения ', response, 'error');
            setTimeout(function() {
                ConnectOctoprint();
                }, 2000);
        });
}

