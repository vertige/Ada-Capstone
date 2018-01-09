const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const dialogflowClient = require('apiai');
const http = require('requestify');


exports.dialogflowProxy = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const dialogflowKey = functions.config().dialogflow.key;
    // console.log(request.query.message);
    const { query: { message } } = request;
    const { query: { sessionId } } = request;
    const req = dialogflowClient(dialogflowKey).textRequest(message, { sessionId });

    req.on('response', (res) => {
      // testing Ravelry calls
      let ravelry = '';
      http.get('https://api.ravelry.com/patterns/search.json', {
        // method: 'GET',
        auth: {
          username: functions.config().ravelry.username,
          password: functions.config().ravelry.password,
        },
        params: {
          query: 'Brain Hat',
        },
      })
        .then((ravResponse) => {
          ravelry = ravResponse.getBody();
          console.log(ravelry);
        });

      response.send(`${res.result.fulfillment.speech} ACTION: ${res.result.action}`);
    });

    req.on('error', (error) => {
      response.send(error);
    });
    req.end();
  });
});
