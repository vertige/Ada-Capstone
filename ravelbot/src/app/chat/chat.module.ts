import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { ChatService } from '../chat.service';
import { ScrollToDirective, AutofocusDirective, ChatDialogComponent } from './chat-dialog/chat-dialog.component';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule
  ],
  declarations: [ ScrollToDirective, AutofocusDirective, ChatDialogComponent ],
  exports: [ ScrollToDirective, AutofocusDirective, ChatDialogComponent ],
  providers: [ ChatService ]
})
export class ChatModule { }
