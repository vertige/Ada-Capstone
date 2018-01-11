import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { v4 as uuid } from 'uuid';

// Message class for displaying messages in the component
export class Message {
constructor(public content: string, public sentBy: string) {}
};

export class Prompt {
  constructor(public content: Array<any>) {}
};

@Injectable()
export class ChatService {

  conversation = new BehaviorSubject<Message[]>([]);
  // prompts = new BehaviorSubject<Prompt[]>([]);
  prompts = new Prompt([]);

  readonly DIALOGFLOW_URL = 'https://us-central1-ravelbot.cloudfunctions.net/dialogflowProxy/';

  constructor(private http: HttpClient) { };

  // Sends and receives messages via DialogFlow
  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    this.getResponse(msg).subscribe((responseObject) => {
      const parsedResponse = JSON.parse(responseObject);

      // Give attached options
      if (parsedResponse.attachments.length > 0) {
        // let list = [];
        // for (let option of parsedResponse.attachments) {
        //   let prompt = new Prompt(option);
        //   list.push(prompt);
        // }
        // this.prompts.next(list);

        this.prompts.content = parsedResponse.attachments;

      }

      // Update Bots speech
      let replyText = JSON.parse(responseObject).speech;
      const botMessage = new Message(replyText, 'bot');
      this.update(botMessage);
    });
  };

  // Gets response from dialogflowProxy
  getResponse(msg: string) {
    let params = new HttpParams();
    params = params.set('message', msg);
    params = params.set('sessionId', this.session());


    return this.http.get(this.DIALOGFLOW_URL, { params,  responseType: 'text' });
  };

  // Sends DialogFlow selection
  sendSelection(choice) {
    // clears the prompts
    this.prompts = new Prompt([]);

    const userSelection = new Message(`Selected: ${choice.title} by ${choice.designer}`, 'selector');
    this.update(userSelection);

    // TODO: Call Ravelry for specific pattern
    // return this.http.get(this.DIALOGFLOW_URL, { params,  responseType: 'text' });
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

  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  };

};
