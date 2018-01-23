import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';
import { ScrollToDirective, ChatDialogComponent } from './chat-dialog/chat-dialog.component';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [ ScrollToDirective, ChatDialogComponent ],
  exports: [ ScrollToDirective, ChatDialogComponent ],
  providers: [ ChatService ]
})
export class ChatModule { }
