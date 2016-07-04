exports.handler = function handler(event, context, callback) {
    callback(null, {
        version: '1.0',
        response: {
            outputSpeech: {
                type: 'PlainText',
                text: 'Welcome to the Lambda Signal Corps',
            },
        },
    });
};
