import { Component, OnInit } from '@angular/core';
import { ChatService, Message, Prompt } from '../../chat.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/scan';

@Component({
  selector: 'chat-dialog',
  templateUrl: './chat-dialog.component.html',
  styleUrls: ['./chat-dialog.component.css'],
})

export class ChatDialogComponent implements OnInit {

  messages: Observable<Message[]>;
  formValue: string;
  currentPrompts: Observable<Prompt[]>;

  constructor(public chat: ChatService) { }

  ngOnInit() {
    // Initiates bot
    this.chat.botWelcome();

    // appends to array after each new message is added to the feed
    this.messages = this.chat.conversation.asObservable()
      .scan((accumulated, current) => accumulated.concat(current));

    // if there is a list of options, it will show prompts
    this.currentPrompts = this.chat.prompts.asObservable();
  }

  sendMessage() {
    this.chat.converse(this.formValue);
    this.formValue = '';
  }

  selectOption() {
    this.chat.sendSelection(this.formValue);
    this.formValue = '';
  }

  tempClear() {
    this.chat.resetPrompts();
  }

  goToURL(variable) {
    window.open(`https://www.weavingworks.com/products/${variable}`, "_blank");
  }
}
