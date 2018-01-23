import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';
import { v4 as uuid } from 'uuid';

export class Message {
  constructor(public content: string, public sentBy: string, public action?: string, public options?: Array<any>) {}
};

export class Prompt {
  constructor(public text: string, public action: string, public variable?: string) {};
};

@Injectable()
export class ChatService {

  conversation = new BehaviorSubject<Message[]>([]);
  prompts = new BehaviorSubject<Prompt[]>([]);
  result: {};

  readonly DIALOGFLOW_URL = 'https://us-central1-ravelbot.cloudfunctions.net/dialogflowProxy/';
  readonly DIALOGFLOW_POST_URL = 'https://api.dialogflow.com/v1/query';
  readonly RAVELRY_URL = 'https://us-central1-ravelbot.cloudfunctions.net/ravelryProxy/';
  readonly SHOPIFY_URL = 'https://us-central1-ravelbot.cloudfunctions.net/shopifyProxy/';

  constructor(private http: HttpClient) { };

  // Initiates Ravelbot to welcome message
  botWelcome() {
    const eventData = `{ 'name': 'welcome' }`;
    this.triggerBotEvent(eventData);
  };

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    this.postMessage(msg, 'user')

    this.getResponse(msg).subscribe((responseObject) => {
      const parsedResponse = JSON.parse(responseObject)
      let replyText = parsedResponse.speech;
      let action = parsedResponse.action;
      let options = parsedResponse.attachments;
      this.postMessage(replyText, 'bot', action, options);
      console.log(parsedResponse);

      // Give alternate prompts
      if (action == 'listPatterns') {
        const more = new Prompt('More', 'tempClear');
        const searchAgain = new Prompt('Search Again', 'tempClear');
        const somethingElse = new Prompt(`I'd like to ask something else`, 'tempClear');
        this.prompts.next([more, searchAgain, somethingElse]);
      }
    });
  };

  // Gets response from dialogflowProxy
  getResponse(msg: string) {
    let params = new HttpParams();
    params = params.set('message', msg);
    params = params.set('sessionId', this.session());


    return this.http.get(this.DIALOGFLOW_URL, { params,  responseType: 'text' });
  };

  // Triggers a specific Bot event
  triggerBotEvent(eventData) {
    const language = 'en';
    const timezone = 'America/Los_Angeles';
    const data = `{
      'event': ${eventData},
      'timezone': '${timezone}',
      'lang': '${language}',
      'sessionId': '${this.session()}'
    }`;

    let headers = new HttpHeaders().append('Content-type', 'application/json');
    headers = headers.append('Authorization', 'Bearer 00e16cd8036d4f818851bec93ae63e2d'); // Read-only key

    this.http.post(this.DIALOGFLOW_POST_URL, data, { headers: headers, responseType: 'text' })
    .subscribe((responseObject) => {
      // const parsedResponse = JSON.parse(responseObject);

      // Update Bots speech
      let replyText = JSON.parse(responseObject).result.speech;
      this.postMessage(replyText, 'bot');
    });
  };

  // Sends DialogFlow selection
  sendSelection(choice) {
    this.postMessage(`Your Selected: ${choice.title} by ${choice.designer}`, 'selected');

    // Gets specific pattern info response from ravelryProxy
    let params = new HttpParams();
    params = params.set('patternId', choice.id);


    let details = this.http.get(this.RAVELRY_URL, { params, responseType: 'text' }).take(1).toPromise();
    Promise.resolve(details)
    .then((response) => {

      let patternDetails = this.parsePattern(JSON.parse(response).pattern);
      this.postMessage('Here are the details of your selected pattern:', 'bot', 'showPattern', [patternDetails]);

      let options = [];

      // get prompts
      for (let yarn of patternDetails.yarns) {
        // this.makePrompt(yarn, options);
        this.getYarnURL(yarn).then((productArray) => {
          if (productArray.length > 0) {
            let name = productArray[0];
            let handle = productArray[1];
            options.unshift(new Prompt(`Shop for ${name}`, 'goToURL', handle));
          }
        });

      }
      return options

    }).then((options) => {
      options.push(new Prompt('Search Again', 'tempClear'));
      options.push(new Prompt(`I'd like to ask something else`, 'tempClear'));
      this.prompts.next(options);
    });


    // this.resetPrompts();

    // // Sets up Dialogflow for next step
    // const eventData = `{ 'name': 'patternName', 'data': {'patternId': '${choice.id}'}}`;
    // this.triggerBotEvent(eventData);
  };

  parsePattern(response) {
    let pattern = {
      title: response.name,
      designer: response.pattern_author.name,
      imgURL: response.photos[0].small2_url,
      // id:response.id,
      // gauge: response.gauge,
      gaugeNotes: response.gauge_description,
      // notes: response.notes_html,
      yarns: [],
      yardage: response.yardage_description,
      yarnWeight: response.yarn_weight_description,
    };
    for (let pack of response.packs) {
      const name = pack.yarn_name;
      pattern.yarns.push(name);

    }
    return pattern;
  };

  getYarnURL(yarn) {
    let params = new HttpParams();
    params = params.set('title', yarn);
    return this.http.get(this.SHOPIFY_URL, { params, responseType: 'text' }).take(1).toPromise()
    .then((response) => {
      let products = JSON.parse(response).products;
      let product = products[0];
      if (products.length == 0 || product.published_at == null) { // DNE
        return [];
      } else {
        return [product.title, product.handle];
      }
    });
  }

  resetPrompts() {
    this.prompts.next([]);
  };

  // Gets session id
  session() {
    let sessionId = sessionStorage.getItem('id');
    if (sessionId == null) {
      sessionStorage.setItem('id',uuid());
      sessionId = sessionStorage.getItem('id');
    }
    return sessionId;
  };

  postMessage(output: string, user: string, action?: string, options?: Array<any>) {
    const message = new Message(output, user, action, options);
    // Adds message to source
    this.conversation.next([message]);
  };

};
