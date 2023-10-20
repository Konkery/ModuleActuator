//const ClassAppError = require('M_AppError');
require('M_AppMath').is();

const ClassMiddleActuator = require('ModuleActuator');
const ClassBuzzer = require('Buzzer');

const act_props = ({
    name: "Buzzer",
    type: "actuator",
    channelNames: ['light', 'range'],
    typeInSignal: "analog",
    typeOutSignal: "analog",
    quantityChannel: 1,
    busTypes: [],
    manufacturingData: {
        IDManufacturing: [
            { "Adafruit": "4328435534" }  
        ],
        IDsupplier: [
            { "Adafruit": "4328435534" }  
        ],
        HelpSens: "buzzer"
    }
});

const bz = new ClassBuzzer(act_props, { pins: [P2] });
const ch = bz.GetChannel(0);

ch.Start(2000, {numRep: 2, pulseDur: 1000, prop: 0.5});
//console.log(ch.IsUsed);
