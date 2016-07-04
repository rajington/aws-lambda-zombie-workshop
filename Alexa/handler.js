var tips = [
    'a quieter vehicle is better than a faster one',
    'poorer neighborhoods are better equipped for thieves... and zombies',
    'only travel during daylight hours',
    'make sure you can put out a fire immediately',
    'denim is not only fashionable but lightweight and pretty good against bites',
    'shorter hair is harder for a zombie to grab onto',
];

function buildResponse(message) {
    return {
        version: '1.0',
          response: {
              outputSpeech: {
                  type: 'PlainText',
                  text: message,
              },
          },
    };
}

exports.handler = function handler(event, context, callback) {
    if (event.request.type === 'LaunchRequest') {
        callback(null, buildResponse('Welcome to the Lambda Signal Corps!'));
    } else if (event.request.type === 'IntentRequest') {
        var intent = event.request.intent;
        if (intent.name === 'AMAZON.StopIntent') {
            callback(null, buildResponse('Good luck out there.'));
        } else if (intent.name === 'TipsIntent') {
            var randomIndex = Math.floor(Math.random() * tips.length);
            callback(null, buildResponse(tips[randomIndex]));
        }
    }
};
