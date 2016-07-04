var https = require('https');

var tips = [
    'a quieter vehicle is better than a faster one',
    'poorer neighborhoods are better equipped for thieves... and zombies',
    'only travel during daylight hours',
    'make sure you can put out a fire immediately',
    'denim is not only fashionable but lightweight and pretty good against bites',
    'shorter hair is harder for a zombie to grab onto',
];

// builds an Alexa-suitable response
function buildResponse(message, shouldEndSession, sessionAttributes) {
    return {
        version: '1.0',
        sessionAttributes: sessionAttributes,
        response: {
            outputSpeech: {
                type: 'PlainText',
                text: message,
            },
            shouldEndSession: shouldEndSession,
        },
    };
}

exports.handler = function handler(event, context, callback) {
    if (event.request.type === 'LaunchRequest') {
        callback(null, buildResponse('Welcome to the Lambda Signal Corps!', true));
    } else if (event.request.type === 'IntentRequest') {
        var intent = event.request.intent;
        if (intent.name === 'AMAZON.StopIntent') {
            callback(null, buildResponse('Good luck out there.', true));
        } else if (intent.name === 'TipsIntent' ||
                   intent.name === 'AMAZON.NextIntent' ||
                   intent.name === 'AMAZON.PreviousIntent' ||
                   intent.name === 'AMAZON.RepeatIntent') {
            var index;
            if (event.session.attributes && event.session.attributes.hasOwnProperty('tipIndex')) {
                index = event.session.attributes.tipIndex;
                if (intent.name === 'AMAZON.PreviousIntent') {
                    index--;
                } else if (intent.name !== 'AMAZON.RepeatIntent') {
                    index++;
                }
                // clamp the index to be in the valid range, >= 0 and < length
                index = (index + tips.length) % tips.length;
            } else {
                index = Math.floor(Math.random() * tips.length);
            }
            callback(null, buildResponse(tips[index], false, { tipIndex: index }));
        } else if (intent.name === 'RationsIntent') {
            var days = intent.slots.Days;
            var people = intent.slots.People;
            var gallons = intent.slots.Gallons;

            var message;
            if (!days.hasOwnProperty('value')) {
                days.value = Math.round(gallons.value / people.value);
                message = 'You will run out of water in about ' + days.value + ' days.';
            } else if (!gallons.hasOwnProperty('value')) {
                gallons.value = Math.ceil(days.value * people.value);
                message = gallons.value + ' gallons should be enough.';
            } else if (!people.hasOwnProperty('value')) {
                people.value = Math.floor(gallons.value / days.value);
                message = 'You only have enough for ' + people.value + ' people.';
            }
            callback(null, buildResponse(message, true));
        } else if (intent.name === 'ReinforcementsIntent') {
            var checkpoint = intent.slots.Checkpoint.value;

            var data = JSON.stringify({
                message: 'Reinforcements needed at checkpoint ' + checkpoint,
                name: 'Alexa',
                channel: 'default',
            });

            // Object of options to designate where to send our request
            var options = {
                host: 'INSERT YOUR API GATEWAY URL HERE',
                port: '443',
                path: '/ZombieWorkshopStage/zombie/message',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length,
                },
            };

            var req = https.request(options, function (res) {
                var body = '';
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    body += chunk;
                });

                res.on('end', function () {
                    callback(null, buildResponse('Message sent', true));
                });
            });
            req.write(data);
            req.end();
        }
    }
};
