/* Processing data module */
/* This file is part of the 3DPrinter Project

   __author__ = 'Sazonov Vladislav Sergeevich <1v1expert@gmail.com>'
   __copyright__ = 'Copyright (C) 2018 VLADDOS'
   __license__ = 'GNU General Public License v2 http://www.gnu.org/licenses/gpl2.html'
*/
var ChangedState = function (state) {
    if (state === 'Operational'){
        SuccessConect();
    }
    else {
        PrinterState(state);
    }
};
var ProcessingData = function (data) {
    "use strict";
    //console.log('============');
    var foundPos = data.indexOf('a[');
    if (~foundPos)
    {
        var strData = data.substring(foundPos+1);
        var jsonData = JSON.parse(strData)[0];
        //console.log('Совпадение есть -- >');
        //console.log(jsonData[0]);
        //-----
        var event = JSON.parse(strData, function (key, value) {

            if (key === 'event') {
                console.log('Event - ' , value);
                //console.log('RINF EVENT', value['payload']['x'], value['payload']['y']);
                $('#coorX').text(value['payload']['x']);
                $('#coorY').text(value['payload']['y']);
                $('#coorZ').text(value['payload']['z']);
                $('#coorE').text(value['payload']['e']);
                return value['payload'];
            }
            if (key === 'current') {ChangedState(value['state']['text']);console.log('StatE ->', value['state']['text'])};
            return value;
        });
        //console.log("!!!!_____-=", event[0].event);
        //console.log("!!!!_____-=", event[0].current);
        //if (jsonData[0]['event']['payload']){
         //   console.log('!!!! - ', jsonData[0]['event']['payload']);
        //}
        //-----
        console.log(data);
    };
    //console.log(event);
};
