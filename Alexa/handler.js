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
        callback(null, buildResponse('Good luck out there.'));
    }
};
