import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AudioRecordingService } from './src/services/audio-recording.service';
import { BotComponent } from './src/components/bot/bot.component';
import { HttpClientModule } from '@angular/common/http';
import { SessionService } from './src/services/session.service';

@NgModule({
  declarations: [
    AppComponent,BotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [AudioRecordingService,SessionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
