translate_state = {
    Operational: "Готов к печати",
    Printing: "Идёт печать"
},
    Definition = {
    Extrude: 5
    },
    Temp = {
        PLA: {
            Bed: 70,
            Tool: 200
        },
        ABS: {
            Bed: 70,
            Tool: 200
        },
        Default: {
            Bed: 70,
            Tool: 200
        }
    },
buttons = {
    General:
    [
        {
            name: "Калибровка",
            command: '{"commands": ["M206 Z0", "M666 X0 Y0 Z0", "G32", "G31", "G28", "G1 Z22.1 F2000", "G30 Y0", "M374", "M500", "G28"]}'
        },
        {
            name: "M999",
            command: '{"command": "M999"}'
        }
    ],
    Aditional:
    [

    ]
};
