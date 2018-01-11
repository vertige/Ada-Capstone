import { Component, OnInit } from '@angular/core';
import { ChatService, Message, Prompt } from '../../chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';

@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css']
})

export class ChatDialogComponent implements OnInit {

  messages: Observable<Message[]>;
  formValue: string;
  currentPrompt: Prompt;

  constructor(public chat: ChatService) { }

  ngOnInit() {
    // appends to array after each new message is added to the feed
    this.messages = this.chat.conversation.asObservable()
      .scan((accumulated, current) => accumulated.concat(current));

    this.currentPrompt = this.chat.prompts
    // this.currentPrompt = this.chat.prompts.asObservable()
      // .scan((accumulated, current) => accumulated.concat(current));

    console.log(this.currentPrompt)
  }

  sendMessage() {
    this.chat.converse(this.formValue);
    this.formValue = '';
  }

  selectOption() {
    this.chat.sendSelection(this.formValue);
    // this.currentPrompt.release();
  }
}
