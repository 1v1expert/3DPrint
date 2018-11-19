/* Processing data module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/

var global = window || this;
global.global_state = '';

var ChangeStatePrint = function (state) {
    "use strict";
    $('#status_print').text(translate_state[state]);

    if (global_state === 'Printing' && state === 'Operational'){
        $('#estimatedPrintTime').text('');
        $('#printTime').text('');
    }
    PrinterState(translate_state[state]);
    global_state = state;
};
var ChangedState = function (state) {
    if (state === global_state){
        //console.log(state);
        $('#status_printt').text(state);
    }
    else {
        ChangeStatePrint(state);
    }
};
var InfoPrinting = function (info) {
    "use strict";
    if (info.progress.printTime === null){
        //console.log("NULLLLLLL!!!!");
    }
    else {
        //console.log('printtime ->', info.progress.printTime);
        $('#estimatedPrintTime').text("Печатается: " + moment.unix(Number(info.progress.printTime)).utc().format('HHH:mm:ss'));
        $('#printTime').text("Осталось: " + moment.unix(Number(info.progress.printTimeLeft)).utc().format('HHH:mm:ss'));
        $('#progress').html(Math.round(info.progress.completion) + '%');
        $('#progress').css('width', Math.round(info.progress.completion) + '%');
        $('#file_name').text("Файл: " + info.job.file.name);
    }
};
var ProcessingData = function (data) {
    "use strict";
    //console.log('============');
    var foundPos = data.indexOf('a[');
    //console.log('Process data', data);
    if (~foundPos)
    {
        var strData = data.substring(foundPos+1);
        var jsonData = JSON.parse(strData)[0];
        //console.log('Совпадение есть -- >');
        //console.log(jsonData[0]);
        //-----
        var event = JSON.parse(strData, function (key, value) {

            if (key === 'event') {
                console.log('key event-> ', value);
                //console.log('Event - ' , value);
                //console.log('RINF EVENT', value['payload']['x'], value['payload']['y']);
                $('#coorX').text(value['payload']['x']);
                $('#coorY').text(value['payload']['y']);
                $('#coorZ').text(value['payload']['z']);
                $('#coorE').text(value['payload']['e']);
                return value['payload'];
            }
            if (key === 'current') {
                console.log('key current-> ', value);
                ChangedState(value.state.text);
                InfoPrinting(value);

                //InfoPrinting(value['progress']);
                //MessageOutput(value['messages']);
                //MessageOutput(value['logs']);
                //console.log('StatE ->', value);
            }
            return value;
        });
        //console.log("!!!!_____-=", event[0].event);
        //console.log("!!!!_____-=", event[0].current);
        //if (jsonData[0]['event']['payload']){
         //   console.log('!!!! - ', jsonData[0]['event']['payload']);
        //}
        //-----
        //console.log('!!!! - ', data);
    }
    //console.log(event);
};
