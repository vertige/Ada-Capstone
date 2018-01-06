import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

// Message class for displaying messages in the component
export class Message {
constructor(public content: string, public sentBy: string) {}
}

@Injectable()
export class ChatService {

  conversation = new BehaviorSubject<Message[]>([]);

  readonly DIALOGFLOW_URL = 'https://us-central1-ravelbot.cloudfunctions.net/dialogflowProxy/';

  constructor(private http: HttpClient) { };

  // Sends and receives messages via DialogFlow

  converse(msg: string) {
    console.log("This is in Chrome, right?");
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    this.getResponse(msg).subscribe((reply) => {
      console.log("In the callback");
      const botMessage = new Message(reply, 'bot');
      this.update(botMessage);
    });;
  };

  // Gets response from dialogflowProxy
  getResponse(msg: string) {
    let params = new HttpParams();
    params = params.set('message', msg);
    //TODO: Set {sessionId} somehow

    return this.http.get(this.DIALOGFLOW_URL, { params,  responseType: 'text' })
  };
  
  // Adds message to source
  update(msg: Message) {
  this.conversation.next([msg]);
  };

};
