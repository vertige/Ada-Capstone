const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const dialogflowClient = require('apiai');


exports.dialogflowProxy = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const dialogflowKey = functions.config().dialogflow.key;
    // console.log(request.query.message);
    const { query: { message } } = request;
    const { query: { sessionId } } = request;
    const req = dialogflowClient(dialogflowKey).textRequest(message, { sessionId });

    req.on('response', (res) => {
      response.send(res.result.fulfillment.speech);
    });

    req.on('error', (error) => {
      response.send(error);
    });

    req.end();
  });
});
