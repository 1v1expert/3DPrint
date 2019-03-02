/* Socket handler module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/

var is_connect_server = false, is_connect_printer = false;
var socket = null;
var ConnectServer = function () {
    "use strict";
    //var setting = settings;
    console.log('Start func IsConnectServer');
    var setting = {
        "async": true,
        "url": "http://127.0.0.1:5000/api/connection",
        "crossDomain": true,
        "method": "GET",
        "headers": {
            "x-api-key": ActiveApi,
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "success": function (response) {
            //"ws://127.0.0.1:5000/sockjs/627/mvy2qfdj/websocket"
            //var socket = new WebSocket("ws://0.0.0.0:5000/sockjs/627/mvy2qfdj/websocket");
            //Set socket connection
            socket = new WebSocket("ws://0.0.0.0:5000/sockjs/049/lvva5lo4/websocket");
            //alert(socket);
            //alert(socket2);
            //console.log(socket, "EEQQQ");
            //socket.onopen = function() { alert("Connection opened...") };
            socket.onmessage = function(event) {
                is_connect_server = true;
                ProcessingData(event.data);

            };
            socket.onclose = function(event) {
                if (event.wasClean) {
                    alert('Соединение закрыто чисто');
                } else {
                    alert('Обрыв соединения');
                    }
                    alert('Код: ' + event.code + ' причина: ' + event.reason);
            };
            if (response.current.state === 'Closed')
            {
                ConnectPrinter();
            }
            if (response.current.state === 'Operational')
            {
                is_connect_printer = true;
            }

        },
        "error": function () {
            $('#status_print').text("ПРОБЛЕМА С СЕРВЕРОМ...");
            is_connect_server = false;
            MessageOutput('Ошибка', 'подключения сервера, повтор через 5с', 'error', 2900);
            setTimeout(function () {
                ConnectServer();
                }, 5000);
        }};
    $.ajax(setting).done(function (response) {console.log(response);});
};
