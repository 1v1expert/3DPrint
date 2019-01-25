# -*- coding: utf-8 -*-

PORT = 5002
cookie_secret = "61oETzKXQAGaYdkL5gEmGeJJFuYh7EQnp2XdTP1o/Vo="
CONFIG = {
	"BaseUrl": "http://localhost:5000",
	"Login": "vladdos",
	"Password": "@WSX2wsx123",
	"Apikey": "5C761F424E5E46EE934DE9F683609B66"
}
translate_state = {
	"Operational": "Готов к печати",
	"Printing": "Идёт печать",
	"Paused": "Печать приостановлена",
	"Pausing": "В режиме паузы",
	"Error": "Ошибка",
	"Cancelling": "Печать отменена"
}
Definition = {
	"Extrude": 5,
	"Target": 300
}
Temp = {
	"PLA": dict(Bed=70, Tool=200),
	"ABS": dict(Bed=70, Tool=200),
	"Default": dict(Bed=72, Tool=201),
}

buttons = {
	"OnPause": '{"command": "M600"}',
	"CancPause": '{"command": "M601"}',
	"General":
		[
			{
				"name": "Калибровка",
				"command": '{"commands": ["M206 Z0", "M666 X0 Y0 Z0", "G32", "G31", "G28", "G1 Z22.1 F2000", "G30 Y0", "M374", "M500", "G28"]}'
			},
			{
				"name": "M999",
				"command": '{"command": "M999"}'
			}
		],
	"Aditional":[]
};
