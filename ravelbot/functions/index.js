const functions = require('firebase-functions');
const cors = require('cors')({ origin: true });
const dialogflowClient = require('apiai');
const http = require('requestify');
const request2 = require('request');


exports.dialogflowProxy = functions.https.onRequest((request, response) => {
  // // Parameters are any entites that Dialogflow has extracted from the request.
  // const parameters = req.body.result.parameters;
  // // Contexts are objects used to track and store conversation state
  // const inputContexts = req.body.result.contexts;
  // // Get the request source slack/facebook/et
  // const requestSource = (req.body.originalRequest) ? req.body.originalRequest.source : undefined

  const responseObject = {
    action: 'default',
    speech: '',
    attachments: [],
  };

  const actionHandlers = {
    ravelryFindPattern: (res) => {
      const patternName = res.result.parameters['pattern-title'];
      responseObject.action = 'listPatterns';
      responseObject.speech = `I searched Ravelry for "${patternName}" and found the following (please make a selection):`;
      responseObject.entity = patternName;
      return http.get('https://api.ravelry.com/patterns/search.json', {
        auth: {
          username: functions.config().ravelry.username,
          password: functions.config().ravelry.password,
        },
        params: {
          query: patternName,
          page_size: '5',
        },
      })
        .then((ravResponse) => {
          const patternList = ravResponse.getBody().patterns;
          for (const pattern of patternList) {
            responseObject.attachments.push({
              title: pattern.name,
              imgURL: pattern.first_photo.small_url,
              id: `${pattern.id}`,
              designer: pattern.designer.name,
            });
          }
          return responseObject;
        });
    },
    default: (res) => {
      responseObject.speech = res.result.fulfillment.speech;
      return Promise.resolve(responseObject);
    },
  };

  cors(request, response, () => {
    const dialogflowKey = functions.config().dialogflow.key;
    const { query: { message } } = request;
    const { query: { sessionId } } = request;
    const req = dialogflowClient(dialogflowKey).textRequest(message, { sessionId });

    req.on('response', (res) => {
      // An action is a string used to identify what needs to be done in fulfillment
      let { result: { action } } = res; // let action = res.result.action

      if (!actionHandlers[action]) {
        action = 'default';
      }

      actionHandlers[action](res).then(val => response.send(val));
    });

    req.on('error', (error) => {
      responseObject.speech = 'I\'m sorry, my server-brain is taking a nap... I know nothing :(';
      console.log(error);
      response.send(responseObject);
    });

    req.end();
  });
});

exports.ravelryProxy = functions.https.onRequest((request, response) => {
  cors(request, response, () => {
    const { query: { patternId } } = request;
    Promise.resolve(http.get(`https://api.ravelry.com/patterns/${patternId}.json`, {
      auth: {
        username: functions.config().ravelry.username,
        password: functions.config().ravelry.password,
      },
    })).then(val => response.send(val.body));
  });
});

exports.shopifyProxy = functions.https.onRequest((request, response) => {
  const key = functions.config().shopify_api.private_key;
  const password = functions.config().shopify_api.private_password;
  const authEncoded = Buffer.from(`${key}:${password}`, 'ascii').toString('base64');
  const { query: { title } } = request;

  cors(request, response, () => {
    const options = {
      method: 'GET',
      url: 'https://weaving-works.myshopify.com/admin/products.json',
      qs: {
        title,
        fields: 'published_at,title,handle',
      },
      headers: {
        'postman-token': 'a0241dbb-761d-bd0e-1173-817a6d3e822d',
        'cache-control': 'no-cache',
        authorization: `Basic ${authEncoded}`,
      },
    };

    request2(options, (error, res, body) => {
      if (error) throw new Error(error);

      console.log(body);
      response.send(body);
    });
  });
});
