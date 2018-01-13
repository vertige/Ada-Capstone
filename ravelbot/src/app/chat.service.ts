import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { v4 as uuid } from 'uuid';

// Message class for displaying messages in the component
export class Message {
  constructor(public content: string, public sentBy: string) {}
};

export class Prompt {
  constructor(public content: Array<any>) {};
  clear() { this.content.splice(0, this.content.length) };
};

@Injectable()
export class ChatService {

  conversation = new BehaviorSubject<Message[]>([]);
  // prompts = new BehaviorSubject<Prompt[]>([]);
  prompts = new Prompt([]);

  readonly DIALOGFLOW_URL = 'https://us-central1-ravelbot.cloudfunctions.net/dialogflowProxy/';

  // readonly DIALOGFLOW_POST_URL = 'https://us-central1-ravelbot.cloudfunctions.net/dialogflowPost';

  readonly DIALOGFLOW_POST_URL = 'https://api.dialogflow.com/v1/query'

  constructor(private http: HttpClient) { };

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    this.getResponse(msg).subscribe((responseObject) => {
      const parsedResponse = JSON.parse(responseObject);
      console.log(parsedResponse);
      // Give attached options if available
      if (parsedResponse.attachments.length > 0) {
        this.prompts.content = parsedResponse.attachments;
      }

      // Update Bots speech
      let replyText = JSON.parse(responseObject).speech;
      this.postBot(replyText);
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
      text = `${text}-${option.title} by ${option.designer}\n`
    }
    this.postSelector(text);
  };

  // Sends DialogFlow selection
  sendSelection(choice) {
    const userSelection = new Message(`You Selected: ${choice.title} by ${choice.designer}`, 'selector');
    this.update(userSelection);

    // TODO: Tell Dialogflow there's been a selection.  Call Ravelry for specific pattern
    // let event = `{'name': 'test_event', 'data': {'name': 'Joy!'}}`;
    // let params = new HttpParams();
    // // params = params.set('message', 'something');
    // params = params.set('v', '20150910');
    // params = params.set('e', event);
    // params = params.set('sessionId', this.session());
    // params = params.set('lang', 'en');

    const data = `{'event': {'name': 'test_event', 'data': {'name': 'Joy!'}}, 'timezone':'America/Los_Angeles', 'lang':'en', 'sessionId':'${this.session()}'}`

    let headers = new HttpHeaders().append('Content-type', 'application/json');
    headers = headers.append('Authorization', 'Bearer 00e16cd8036d4f818851bec93ae63e2d');

    this.http.post(this.DIALOGFLOW_POST_URL, data, { headers: headers, responseType: 'text' })
      .subscribe((responseObject) => {
        console.log(responseObject);
        const parsedResponse = JSON.parse(responseObject);

        // Update Bots speech
        let replyText = JSON.parse(responseObject).speech;
        this.postBot(replyText);
      });

    // return this.http.get(this.DIALOGFLOW_URL, { params,  responseType: 'text' });
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

  postBot(output: string) {
    const botMessage = new Message(output, 'bot');
    this.update(botMessage);
  };

  postSelector(output: string) {
    const message = new Message(output, 'selector');
    this.update(message);
  };

  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  };

};
