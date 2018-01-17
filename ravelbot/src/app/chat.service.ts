import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { v4 as uuid } from 'uuid';

export class Message {
  constructor(public content: string, public sentBy: string, options: []) {}
};

export class Prompt {
  constructor(public content: Array<any>) {};
  clear() { this.content.splice(0, this.content.length) };
};

@Injectable()
export class ChatService {

  conversation = new BehaviorSubject<Message[]>([]);
  prompts = new Prompt([]);

  readonly DIALOGFLOW_URL = 'https://us-central1-ravelbot.cloudfunctions.net/dialogflowProxy/';

  readonly DIALOGFLOW_POST_URL = 'https://api.dialogflow.com/v1/query'

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
      const parsedResponse = JSON.parse(responseObject);
      // Give attached options if available
      if (parsedResponse.attachments.length > 0) {
        this.prompts.content = parsedResponse.attachments;
      }

      let replyText = JSON.parse(responseObject).speech;
      this.postMessage(replyText, 'bot');
    });
  };

  // Gets response from dialogflowProxy
  getResponse(msg: string) {
    let params = new HttpParams();
    params = params.set('message', msg);
    params = params.set('sessionId', this.session());


    return this.http.get(this.DIALOGFLOW_URL, { params,  responseType: 'text' });
  };

  // Sends a list of previous postOptions
  postOptions(options) {
    let text = 'Your options were: \n'
    for (let option of options) {
      text = `${text}\n- ${option.title} by ${option.designer}\n`
    }
    this.postMessage(text, 'selected');
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
      const parsedResponse = JSON.parse(responseObject);

      // Update Bots speech
      let replyText = JSON.parse(responseObject).result.speech;
      this.postMessage(replyText, 'bot');
    });
  };

  // Sends DialogFlow selection
  sendSelection(choice) {
    console.log(choice);
    this.postMessage(`You Selected: ${choice.title} by ${choice.designer}`, 'bot');

    // TODO: Call Ravelry for specific pattern

    // Sets up Dialogflow for next step
    const eventData = `{ 'name': 'patternName', 'data': {'patternId': '${choice.id}'}}`;

    this.triggerBotEvent(eventData);

    // Clears the prompts
    this.prompts.clear();
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

  postMessage(output: string, user: string) {
    const message = new Message(output, user);
    // Adds message to source
    this.conversation.next([message]);
  };

};
