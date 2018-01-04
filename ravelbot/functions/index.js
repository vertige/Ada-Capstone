const functions = require('firebase-functions');
const dialogflowClient = require('apiai');


exports.dialogflowProxy = functions.https.onRequest((request, response) => {
  const dialogflowKey = functions.config().dialogflow.key;
  const message = request.query.message;
  const req = dialogflowClient(dialogflowKey).textRequest(message, { sessionId: 'someSessionID' });

  req.on('response', (res) => {
    response.send(res.result.fulfillment.speech);
  });

  req.on('error', (error) => {
    response.send(error);
  });

  req.end();
});
