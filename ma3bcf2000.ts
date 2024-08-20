// ma3bcf2000v 1.0.8 by ArtGateOne
import easymidi, { Channel } from 'easymidi';
import osc from 'osc';
// import OSC from 'osc-js';

// TO-DO: or maybe use this: https://github.com/xxpasixx/pam-osc?tab=readme-ov-file

// const oscNew = new OSC();

// TO-DO: replace with osc-js (https://www.npmjs.com/package/osc-js)

// Configuration
// const midiInDevice = 'BCF2000'; // Set correct MIDI in device name
const midiInDevice = 'Swissonic MidiConnect 2 Port 1'; // Set correct MIDI in device name
// const midiOutDevice = 'BCF2000'; // Set correct MIDI out device name
const midiOutDevice = 'Swissonic MidiConnect 2 Port 2'; // Set correct MIDI out device name
// const midiOutDevice = 'Virtual MIDI Bus 1'; // Set correct MIDI out device name
const localIp = '127.0.0.1';
const localPort = 8001; // Receive port from MA3
const remoteIp = '127.0.0.1';
const remotePort = 8000; // Send port to MA3

const autoLedFeedback = true; // LED feedback on controller (0 = off, 1 = on)
const autoFaderFeedback = false; // Fader stay ion position - without feedback from MA3 (0 = off, 1 = on)

// Config (you can set any command)
// Right side buttons (10)
const command_0 = 'ViewButton 1.1'; // Top right Up
const command_1 = 'ViewButton 1.2'; // Top right 2
const command_2 = 'Macro 9'; // Sore button
const command_3 = 'ViewButton 1.3'; // Learn button
const command_4 = 'Macro 10'; // Edit button
const command_5 = 'ViewButton 1.4'; // Exit button
const command_6 = 'Previous Page'; // Preset left arrow
const command_7 = 'Next Page'; // Preset right arrow
const command_8 = 'Macro 11'; // Bottom left up
const command_9 = 'ViewButton 1.5 '; // Bottom right up
const command_10 = 'Macro 12'; // Bottom left
const command_11 = 'ViewButton 1.7'; // Bottom right

// Encoder press
// Run Macro N in MA3 when encoder N is pressed
const encoder1_click = 'Macro 1';
const encoder2_click = 'Macro 2';
const encoder3_click = 'Macro 3';
const encoder4_click = 'Macro 4';
const encoder5_click = 'Macro 5';
const encoder6_click = 'Macro 6';
const encoder7_click = 'Macro 7';
const encoder8_click = 'Macro 8';

let F301 = 0;
let F302 = 0;
let F303 = 0;
let F304 = 0;
let F305 = 0;
let F306 = 0;
let F307 = 0;
let F308 = 0;

let keyPressed = 0;

// MIDI
// Display info
console.log('BCF2000 MA3 OSC');
console.log(' ');

// Display all MIDI devices
console.log('Midi IN');
console.log(easymidi.getInputs());
console.log('Midi OUT');
console.log(easymidi.getOutputs());

console.log(' ');

console.log('Connecting to MIDI input device: ' + midiInDevice);
console.log('Connecting to MIDI output device: ' + midiOutDevice);

const midiInput = new easymidi.Input(midiInDevice); // Open MIDI in
const midiOutput = new easymidi.Output(midiOutDevice); // Open MIDI out

// // Set up a new MIDI input
// const midiInputz = new MidiInput();

// // Set up a new MIDI output
// const midiOutputz = new MidiOutput();

// // Open the loopMIDI MIDI input device
// for (let i = 0; i < midiInputz.getPortCount(); i++) {
//     if (midiInputz.getPortName(i).includes('Swissonic MidiConnect 2 Port 1')) {
//         midiInputz.openPort(i);
//         console.log('Successfully opened loopMIDI input port!');
//         break;
//     }
// }

// // Open the loopMIDI MIDI output device
// for (let i = 0; i < midiOutputz.getPortCount(); i++) {
//     if (midiOutputz.getPortName(i).includes('Swissonic MidiConnect 2 Port 2')) {
//         midiOutputz.openPort(i);
//         console.log('Successfully opened loopMIDI output port!');
//         break;
//     }
// }

midiClear();

// Create an osc.js UDP Port listening on port 8000.
const udpPort = new osc.UDPPort({
    localAddress: localIp,
    localPort: localPort,
    metadata: true,
});

// Listen for incoming OSC messages
udpPort.on('message', (oscMsg: { address: string; args: { value: number }[] }, timeTag, info) => {
    console.log('oscMsg', oscMsg, timeTag, info);

    if (oscMsg.address == '/Fader201') {
        moveFader(0, oscMsg.args[0].value);
    } //if get Fader2xx ---> control midi fader
    else if (oscMsg.address == '/Fader202') {
        moveFader(1, oscMsg.args[0].value);
    } else if (oscMsg.address == '/Fader203') {
        moveFader(2, oscMsg.args[0].value);
    } else if (oscMsg.address == '/Fader204') {
        moveFader(3, oscMsg.args[0].value);
    } else if (oscMsg.address == '/Fader205') {
        moveFader(4, oscMsg.args[0].value);
    } else if (oscMsg.address == '/Fader206') {
        moveFader(5, oscMsg.args[0].value);
    } else if (oscMsg.address == '/Fader207') {
        moveFader(6, oscMsg.args[0].value);
    } else if (oscMsg.address == '/Fader208') {
        moveFader(7, oscMsg.args[0].value);
    } else if (oscMsg.address == '/Fader301') {
        F301 = oscMsg.args[0].value;
        lightEncoder(48, F301);
    } else if (oscMsg.address == '/Fader302') {
        //if get Fader3xx ---> control encoder led
        F302 = oscMsg.args[0].value;
        lightEncoder(49, F302);
    } else if (oscMsg.address == '/Fader303') {
        F303 = oscMsg.args[0].value;
        lightEncoder(50, F303);
    } else if (oscMsg.address == '/Fader304') {
        F304 = oscMsg.args[0].value;
        lightEncoder(51, F304);
    } else if (oscMsg.address == '/Fader305') {
        F305 = oscMsg.args[0].value;
        lightEncoder(52, F305);
    } else if (oscMsg.address == '/Fader306') {
        F306 = oscMsg.args[0].value;
        lightEncoder(53, F306);
    } else if (oscMsg.address == '/Fader307') {
        F307 = oscMsg.args[0].value;
        lightEncoder(54, F307);
    } else if (oscMsg.address == '/Fader308') {
        F308 = oscMsg.args[0].value;
        lightEncoder(55, F308);
    } else if (oscMsg.address == '/Key301') {
        //if get Keyxxx ---> control key led
        midiOutput.send('noteon', {
            note: 16,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key302') {
        midiOutput.send('noteon', {
            note: 17,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key303') {
        midiOutput.send('noteon', {
            note: 18,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key304') {
        midiOutput.send('noteon', {
            note: 19,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key305') {
        midiOutput.send('noteon', {
            note: 20,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key306') {
        midiOutput.send('noteon', {
            note: 21,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key307') {
        midiOutput.send('noteon', {
            note: 22,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key308') {
        midiOutput.send('noteon', {
            note: 23,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key201') {
        midiOutput.send('noteon', {
            note: 24,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key202') {
        midiOutput.send('noteon', {
            note: 25,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key203') {
        midiOutput.send('noteon', {
            note: 26,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key204') {
        midiOutput.send('noteon', {
            note: 27,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key205') {
        midiOutput.send('noteon', {
            note: 28,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key206') {
        midiOutput.send('noteon', {
            note: 29,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key207') {
        midiOutput.send('noteon', {
            note: 30,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    } else if (oscMsg.address == '/Key208') {
        midiOutput.send('noteon', {
            note: 31,
            velocity: oscMsg.args[0].value * 127,
            channel: 0,
        });
    }
});

// Open the socket.
udpPort.open();

// When the port is read, send an OSC message to, say, SuperCollider
udpPort.on('ready', function () {
    console.log('READY');
});

midiInput.on('pitch', (pitchMessage) => {
    // Receive fader MIDI and send to OSC
    console.log('pitchMessage', pitchMessage);

    if (autoFaderFeedback) {
        midiOutput.send('pitch', {
            channel: pitchMessage.channel,
            value: pitchMessage.value,
        });
    }

    if (pitchMessage.channel == 0) {
        udpPort.send(
            {
                address: '/Fader201',
                args: [{ type: 'i', value: pitchMessage.value }],
            },
            remoteIp,
            remotePort,
        );
    } else if (pitchMessage.channel == 1) {
        udpPort.send(
            {
                address: '/Fader202',
                args: [{ type: 'i', value: pitchMessage.value }],
            },
            remoteIp,
            remotePort,
        );
    } else if (pitchMessage.channel == 2) {
        udpPort.send(
            {
                address: '/Fader203',
                args: [{ type: 'i', value: pitchMessage.value }],
            },
            remoteIp,
            remotePort,
        );
    } else if (pitchMessage.channel == 3) {
        udpPort.send(
            {
                address: '/Fader204',
                args: [{ type: 'i', value: pitchMessage.value }],
            },
            remoteIp,
            remotePort,
        );
    } else if (pitchMessage.channel == 4) {
        udpPort.send(
            {
                address: '/Fader205',
                args: [{ type: 'i', value: pitchMessage.value }],
            },
            remoteIp,
            remotePort,
        );
    } else if (pitchMessage.channel == 5) {
        udpPort.send(
            {
                address: '/Fader206',
                args: [{ type: 'i', value: pitchMessage.value }],
            },
            remoteIp,
            remotePort,
        );
    } else if (pitchMessage.channel == 6) {
        udpPort.send(
            {
                address: '/Fader207',
                args: [{ type: 'i', value: pitchMessage.value }],
            },
            remoteIp,
            remotePort,
        );
    } else if (pitchMessage.channel == 7) {
        udpPort.send(
            {
                address: '/Fader208',
                args: [{ type: 'i', value: pitchMessage.value }],
            },
            remoteIp,
            remotePort,
        );
    }
});

midiInput.on('cc', (controlChangeMessage) => {
    // ENCODERS

    console.log('controlChangeMessage', controlChangeMessage);

    let encoderValue: number | undefined = undefined;
    if (controlChangeMessage.value == 1) {
        encoderValue = 163.68;
    } else if (controlChangeMessage.value == 2) {
        encoderValue = 327.36;
    } else if (controlChangeMessage.value == 3) {
        encoderValue = 654.72;
    } else if (controlChangeMessage.value == 4) {
        encoderValue = 1309.44;
    } else if (controlChangeMessage.value == 65) {
        encoderValue = -163.68;
    } else if (controlChangeMessage.value == 66) {
        encoderValue = -327.36;
    } else if (controlChangeMessage.value == 67) {
        encoderValue = -654.72;
    } else if (controlChangeMessage.value == 68) {
        encoderValue = -1309.44;
    }

    if (!encoderValue) {
        console.error('No matching encoderValue found for controlChangeMessage', controlChangeMessage);
        return;
    }

    if (controlChangeMessage.controller == 16) {
        // Receive encoder MIDI - and send to osc
        F301 = addValue(F301, encoderValue);
        lightEncoder(48, F301);
        udpPort.send({ address: '/Fader301', args: [{ type: 'i', value: F301 }] }, remoteIp, remotePort);
    } else if (controlChangeMessage.controller == 17) {
        F302 = addValue(F302, encoderValue);
        lightEncoder(49, F302);
        udpPort.send({ address: '/Fader302', args: [{ type: 'i', value: F302 }] }, remoteIp, remotePort);
    } else if (controlChangeMessage.controller == 18) {
        F303 = addValue(F303, encoderValue);
        lightEncoder(50, F303);
        udpPort.send({ address: '/Fader303', args: [{ type: 'i', value: F303 }] }, remoteIp, remotePort);
    } else if (controlChangeMessage.controller == 19) {
        F304 = addValue(F304, encoderValue);
        lightEncoder(51, F304);
        udpPort.send({ address: '/Fader304', args: [{ type: 'i', value: F304 }] }, remoteIp, remotePort);
    } else if (controlChangeMessage.controller == 20) {
        F305 = addValue(F305, encoderValue);
        lightEncoder(52, F305);
        udpPort.send({ address: '/Fader305', args: [{ type: 'i', value: F305 }] }, remoteIp, remotePort);
    } else if (controlChangeMessage.controller == 21) {
        F306 = addValue(F306, encoderValue);
        lightEncoder(53, F306);
        udpPort.send({ address: '/Fader306', args: [{ type: 'i', value: F306 }] }, remoteIp, remotePort);
    } else if (controlChangeMessage.controller == 22) {
        F307 = addValue(F307, encoderValue);
        lightEncoder(54, F307);
        udpPort.send({ address: '/Fader307', args: [{ type: 'i', value: F307 }] }, remoteIp, remotePort);
    } else if (controlChangeMessage.controller == 23) {
        F308 = addValue(F308, encoderValue);
        lightEncoder(55, F308);
        udpPort.send({ address: '/Fader308', args: [{ type: 'i', value: F308 }] }, remoteIp, remotePort);
    }
});

midiInput.on('noteon', function (msg) {
    // Receive MIDI keys and send to OSC

    if (autoLedFeedback) {
        midiOutput.send('noteon', {
            note: msg.note,
            velocity: msg.velocity,
            channel: 0,
        });
    }

    if (msg.velocity == 127) {
        keyPressed = 1;
    } else {
        keyPressed = 0;
    }

    if (msg.note >= 16 && msg.note <= 23) {
        udpPort.send(
            {
                address: '/Key' + (msg.note + 285),
                args: [
                    {
                        type: 'i',
                        value: keyPressed,
                    },
                ],
            },
            remoteIp,
            remotePort,
        );
    } else if (msg.note >= 24 && msg.note <= 31) {
        udpPort.send(
            {
                address: '/Key' + (msg.note + 177),
                args: [
                    {
                        type: 'i',
                        value: keyPressed,
                    },
                ],
            },
            remoteIp,
            remotePort,
        );
    } else if (msg.note == 32)
        if (msg.velocity == 127) {
            // Encoder1 click
            {
                udpPort.send({ address: '/cmd', args: [{ type: 's', value: encoder1_click }] }, remoteIp, remotePort);
            }
        } else {
        }
    else if (msg.note == 33)
        if (msg.velocity == 127) {
            // Encoder2 click
            {
                udpPort.send({ address: '/cmd', args: [{ type: 's', value: encoder2_click }] }, remoteIp, remotePort);
            }
        } else {
        }
    else if (msg.note == 34)
        if (msg.velocity == 127) {
            // Encoder3 click
            {
                udpPort.send({ address: '/cmd', args: [{ type: 's', value: encoder3_click }] }, remoteIp, remotePort);
            }
        } else {
        }
    else if (msg.note == 35)
        if (msg.velocity == 127) {
            // Encoder4 click
            {
                udpPort.send({ address: '/cmd', args: [{ type: 's', value: encoder4_click }] }, remoteIp, remotePort);
            }
        } else {
        }
    else if (msg.note == 36)
        if (msg.velocity == 127) {
            // Encoder5 click
            {
                udpPort.send({ address: '/cmd', args: [{ type: 's', value: encoder5_click }] }, remoteIp, remotePort);
            }
        } else {
        }
    else if (msg.note == 37)
        if (msg.velocity == 127) {
            // Encoder6 click
            {
                udpPort.send({ address: '/cmd', args: [{ type: 's', value: encoder6_click }] }, remoteIp, remotePort);
            }
        } else {
        }
    else if (msg.note == 38)
        if (msg.velocity == 127) {
            // Encoder7 click
            {
                udpPort.send({ address: '/cmd', args: [{ type: 's', value: encoder7_click }] }, remoteIp, remotePort);
            }
        } else {
        }
    else if (msg.note == 39)
        if (msg.velocity == 127) {
            // Encoder8 click
            {
                udpPort.send({ address: '/cmd', args: [{ type: 's', value: encoder8_click }] }, remoteIp, remotePort);
            }
        } else {
        }
    // Right side buttons
    else if (msg.note == 40) {
        if (msg.velocity == 127) {
            udpPort.send({ address: '/cmd', args: [{ type: 's', value: command_1 }] }, remoteIp, remotePort);
        }
    } else if (msg.note == 41) {
        if (msg.velocity == 127) {
            udpPort.send({ address: '/cmd', args: [{ type: 's', value: command_0 }] }, remoteIp, remotePort);
        }
    } else if (msg.note == 42) {
        if (msg.velocity == 127) {
            udpPort.send({ address: '/cmd', args: [{ type: 's', value: command_4 }] }, remoteIp, remotePort);
        }
    } else if (msg.note == 43) {
        if (msg.velocity == 127) {
            udpPort.send({ address: '/cmd', args: [{ type: 's', value: command_3 }] }, remoteIp, remotePort);
        }
    } else if (msg.note == 44) {
        if (msg.velocity == 127) {
            udpPort.send({ address: '/cmd', args: [{ type: 's', value: command_2 }] }, remoteIp, remotePort);
        }
    } else if (msg.note == 45) {
        if (msg.velocity == 127) {
            udpPort.send({ address: '/cmd', args: [{ type: 's', value: command_5 }] }, remoteIp, remotePort);
        }
    } else if (msg.note == 46) {
        if (msg.velocity == 127) {
            udpPort.send({ address: '/cmd', args: [{ type: 's', value: command_6 }] }, remoteIp, remotePort);
        }
    } else if (msg.note == 47) {
        if (msg.velocity == 127) {
            udpPort.send({ address: '/cmd', args: [{ type: 's', value: command_7 }] }, remoteIp, remotePort);
        }
    } else if (msg.note == 91) {
        if (msg.velocity == 127) {
            udpPort.send({ address: '/cmd', args: [{ type: 's', value: command_8 }] }, remoteIp, remotePort);
        }
    } else if (msg.note == 92) {
        if (msg.velocity == 127) {
            udpPort.send({ address: '/cmd', args: [{ type: 's', value: command_9 }] }, remoteIp, remotePort);
        }
    } else if (msg.note == 93) {
        if (msg.velocity == 127) {
            udpPort.send({ address: '/cmd', args: [{ type: 's', value: command_10 }] }, remoteIp, remotePort);
        }
    } else if (msg.note == 94) {
        if (msg.velocity == 127) {
            udpPort.send({ address: '/cmd', args: [{ type: 's', value: command_11 }] }, remoteIp, remotePort);
        }
    }
});

// MIDI clear function
function midiClear() {
    for (let i = 0; i < 128; i++) {
        midiOutput.send('noteon', { note: i, velocity: 0, channel: 0 });
        midiOutput.send('cc', { controller: i, value: 0, channel: 0 });
        if (i < 9) {
            midiOutput.send('pitch', { channel: i as Channel, value: 0 });
        }
    }
}

function addValue(faderValue: number, encoderValue: number) {
    let newFaderValue = faderValue + encoderValue;
    if (newFaderValue < 0) {
        newFaderValue = 0;
    } else if (newFaderValue > 16368) {
        newFaderValue = 16368;
    }

    return newFaderValue;
}

function lightEncoder(controllerNumber: number, faderValue: number) {
    var led = 0;
    if (faderValue == -1) {
        led = 32;
    } else if (faderValue == 0) {
        led = 33;
    } else if (faderValue > 0 && faderValue <= 1636) {
        led = 34;
    } else if (faderValue > 1636 && faderValue <= 3273) {
        led = 35;
    } else if (faderValue > 3273 && faderValue <= 4910) {
        led = 36;
    } else if (faderValue > 4910 && faderValue <= 6547) {
        led = 37;
    } else if (faderValue > 6547 && faderValue <= 8184) {
        led = 38;
    } else if (faderValue > 8184 && faderValue <= 9820) {
        led = 39;
    } else if (faderValue > 9820 && faderValue <= 11457) {
        led = 40;
    } //70
    else if (faderValue > 11457 && faderValue <= 13094) {
        led = 41;
    } else if (faderValue > 13094 && faderValue <= 14731) {
        led = 42;
    } else if (faderValue > 14731 && faderValue <= 16368) {
        led = 43;
    }
    midiOutput.send('cc', {
        controller: controllerNumber,
        value: led,
        channel: 0,
    });

    return;
}

function moveFader(channelNumber: number, faderValue: number) {
    console.log('moveFader', channelNumber, faderValue);

    if (faderValue == -1) {
        faderValue = 0;
    }

    console.log(typeof channelNumber);
    console.log(channelNumber);

    if (channelNumber >= 0 && channelNumber < 16) {
        console.log('hier zou da moeten staan é kirl!');

        // Pitch bend message is pitch bend + channel, LSB and then MSB
        // TO-DO: implement LSB

        // midiOutputz.sendMessage([224 + channelNumber, faderValue & 0x7f, (faderValue & 0x3f80) >> 7]);

        console.log(faderValue & 0x7f, (faderValue & 0x3f80) >> 7);

        // midiOutput.send('cc', {
        //     channel: 1,
        //     controller: 0,
        //     value: 0,
        // });
        // midiOutput.send('cc', {
        //     channel: 1,
        //     controller: 32,
        //     value: 0,
        // });
        midiOutput.send('pitch', {
            value: faderValue,
            channel: channelNumber as Channel,
        });
    }

    return;
}
