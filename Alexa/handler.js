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
        }
    }
};
