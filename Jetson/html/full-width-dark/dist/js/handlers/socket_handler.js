/* Socket handler module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/

var IsConnectServer = function () {
    "use strict";
    console.log('Start func IsConnectServer');
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": "http://127.0.0.1:" + ActivePort + "/api/connection",
        "method": "GET",
        "headers": {
            "x-api-key": ActiveApi,
            "content-type": "application/json",
            "cache-control": "no-cache"
        },
        "processData": false,
        "success": function () {
            //"ws://127.0.0.1:5000/sockjs/627/mvy2qfdj/websocket"
            //var socket = new WebSocket("ws://0.0.0.0:5000/sockjs/627/mvy2qfdj/websocket");
            var socket = new WebSocket("ws://0.0.0.0:5000/sockjs/049/lvva5lo4/websocket");
            //alert(socket);
            //alert(socket2);
            console.log(socket, "EEQQQ");
            //socket.onopen = function() { alert("Connection opened...") };
            socket.onmessage = function(event) {
                ProcessingData(event.data);

                //alert('Active connection');
                //alert(event);
            };

        },
        "error": function () {
            $('#status_print').text("ПРОБЛЕМА С СЕРВЕРОМ...");
        },
    };
    $.ajax(settings).done(function (response) {console.log(response)});
};
