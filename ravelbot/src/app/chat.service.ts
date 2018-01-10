import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { v4 as uuid } from 'uuid';

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
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    this.getResponse(msg).subscribe((responseObject) => {
      let replyText = JSON.parse(responseObject).speech;
      // TODO: handle various actions here
      const botMessage = new Message(replyText, 'bot');
      this.update(botMessage);
    });;
  };

  // Gets response from dialogflowProxy
  getResponse(msg: string) {
    let params = new HttpParams();
    params = params.set('message', msg);
    params = params.set('sessionId', this.session());


    return this.http.get(this.DIALOGFLOW_URL, { params,  responseType: 'text' });
  };

  // TODO: Put actionhandlers here

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
