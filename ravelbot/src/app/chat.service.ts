import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { v4 as uuid } from 'uuid';

export class Message {
  constructor(public content: string, public sentBy: string, public action?: string, public options?: Array<any>) {}
};

export class Prompt {
  constructor(public text: string, public action: string) {};
};

@Injectable()
export class ChatService {

  conversation = new BehaviorSubject<Message[]>([]);
  prompts = new BehaviorSubject<Prompt[]>([]);

  readonly DIALOGFLOW_URL = 'https://us-central1-ravelbot.cloudfunctions.net/dialogflowProxy/';
  readonly DIALOGFLOW_POST_URL = 'https://api.dialogflow.com/v1/query';
  readonly RAVELRY_URL = 'https://us-central1-ravelbot.cloudfunctions.net/ravelryProxy/';

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
    // let details;
    let params = new HttpParams();
    params = params.set('patternId', choice.id);

    this.http.get(this.RAVELRY_URL, { params, responseType: 'text' }).subscribe((response) => {
      let pattern = JSON.parse(response).pattern;
      // console.log(response);
      let details = {
        title: choice.title,
        designer:choice.designer,
        imgURL: choice.imgURL,
        // id:choice.id,
        // gauge: pattern.gauge,
        gaugeNotes: pattern.gauge_description,
        // notes: pattern.notes_html,
        yarns: [],
        yardage: pattern.yardage_description,
        yarnWeight: pattern.yarn_weight_description,
      };
      for (let pack of pattern.packs) {
        details.yarns.push(pack.yarn_name);
      }
      this.postMessage('Here are the details of your selected pattern:', 'bot', 'showPattern', [details]);
    });
    this.resetPrompts();

    // // Sets up Dialogflow for next step
    // const eventData = `{ 'name': 'patternName', 'data': {'patternId': '${choice.id}'}}`;
    // this.triggerBotEvent(eventData);
  };

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
