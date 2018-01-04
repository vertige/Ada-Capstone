import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// Message class for displaying messages in the component
export class Message {
  constructor(public content: string, public sentBy: string) {}
}

@Injectable()
export class ChatService {

  conversation = new BehaviorSubject<Message[]>([]);

  readonly DIALOGFLOW_URL = 'https://us-central1-ravelbot.cloudfunctions.net/dialogflowProxy';

  constructor(http: HttpClient) { };

  // Sends and receives messages via DialogFlow

  converse(msg: string) {
    const userMessage = new Message(msg, 'user');
    this.update(userMessage);

    let params = new HttpParams();
    params = params.set('message', msg);
    //TODO: Set {sessionId} somehow

    const response = this.http.get(this.DIALOGFLOW_URL, { params }).done(
      const speech = response.result.fulfillment.speech;
      const botMessage = new Message(speech, 'bot');
      this.update(botMessage);
    );
  };
  // Adds message to source
  update(msg: Message) {
    this.conversation.next([msg]);
  };

};
