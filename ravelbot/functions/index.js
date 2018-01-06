const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const dialogflowClient = require('apiai');


exports.dialogflowProxy = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const dialogflowKey = functions.config().dialogflow.key;
    // console.log(request.query.message);
    const { query: { message } } = request;
    const req = dialogflowClient(dialogflowKey).textRequest(message, { sessionId: 'someSessionID' });

    req.on('response', (res) => {
      console.log("In receiving a response");
      response.send(res.result.fulfillment.speech);
      console.log(response);
    });

    req.on('error', (error) => {
      console.log("In receiving an error");
      response.send(error);
      console.log(response);
    });

    req.end();
  });
});
