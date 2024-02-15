import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BotMessage } from 'src/app/appConstants';
import { AudioRecordingService } from 'src/app/src/services/audio-recording.service';
import { BotApiService } from '../../services/bot-api.service';

@Component({
  selector: 'bot-component',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss'],
})
export class BotComponent implements OnInit, AfterViewInit {
  botMessages: Array<any> = [];
  textMessage: string = ''
  chat!: BotMessage;
  defaultLoaderMsg!: BotMessage;
  botStartTimeStamp = Date.now();
  public isUserSpeaking: boolean = false;

  isRecording = false;
  recordedTime;
  blobUrl;
  data;

  @Input() config: any = {};
  @Output() botMessageEvent = new EventEmitter();
  @ViewChild('recordbtn', { read: ElementRef }) recordbtn: ElementRef | any;
  @ViewChild('content', { static: false }) content: ElementRef;

  navigated: boolean = false
  duration = 0;
  durationDisplay = '';
  disabled = false;
  audioRef!: HTMLAudioElement;
  ngZone: any;
  constructor(
    private audioRecordingService: AudioRecordingService, private botApiService: BotApiService,
    private sanitizer: DomSanitizer
  ) {
    this.defaultLoaderMsg = { identifier: "", message: 'Loading...', messageType: 'text', displayMsg: 'Loading...', type: 'received', time: '', timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" };
    this.botMessages = [
      { identifier: "", message: 'Hello!! I am Bee the Bot.\nYou can talk to me by pressing the mic button \n What is your name?', messageType: 'text', type: 'received', displayMsg: "Hello!! I am Bee the Bot.\nYou can talk to me by pressing the mic button \n What is your name?", time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" }];
  }

  ngOnInit() {

    this.audioRecordingService.recordingFailed().subscribe(() => (this.isRecording = false));
    this.audioRecordingService.getRecordedTime().subscribe((time) => (this.recordedTime = time));
    this.audioRecordingService.getRecordedBlob().subscribe((data) => {
      this.data = data;
      this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(
        URL.createObjectURL(data.blob)
      );
      console.log('=====', this.data.base64Data);
      this.handleMessage();
    });
  }

  ngAfterViewInit(): void {
  }

  async handleMessage() {
    this.chat = { identifier: "", message: this.data.base64Data,audio:this.data.base64Data, messageType: 'audio', type: 'sent', displayMsg: "Click to View", time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" }
    this.chat = {identifier: "", message: '', messageType: 'audio', displayMsg: "Click to Listen", audio: { file: '', duration: '', play: false }, type: 'sent', time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" }
    this.chat.audio = {  base64Data: this.data.base64Data};
    this.chat.timeStamp = Date.now();
    this.botMessages.push(this.chat);
    await this.makeBotAPICall('',this.chat.audio.base64Data.replace(/^data:audio\/wav;base64,/, ''));
  }

   async makeBotAPICall(text: string, audio: string) {
    this.textMessage = "";
    this.disabled = true;
    // Api call and response from bot, replace laoding text
    let index = this.botMessages.length;
    // let lang = await this.storage.getData('lang');
     await this.botApiService.getBotMessage(text, audio, this.config.type, 'en').subscribe(result => {
      console.log('-----',result)
    this.botMessages = JSON.parse(JSON.stringify(this.botMessages));
      // this.botMessages.forEach(async (msg, i) => {
        if (result.output) {
          let data = result;
          // if(i == index-1 && msg.type === 'received') {
            // msg.time = new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'})
            // msg.timeStamp = Date.now();
            // msg.requestId = result.requestHeaders['X-Request-ID']
            if (data?.output) {
              this.disabled = false;
              // msg.message = data.output?.text;
              // if (data?.output?.text.length > 200 && (data?.output.text.length - 200 > 100)) {
              //   msg.displayMsg = data.output.text.substring(0, 200);
              //   msg.readMore = true;
              // } else {
                // msg.displayMsg = data.output?.text;
              // }
              // this.content.scrollToBottom(300).then(() => {
              //   this.content.scrollToBottom(300)
              // })
              // this.saveChatMessage(msg);
              if (data?.output?.audio) {
                // let duration = await this.fetchAudioDuration(data.output.audio);
                // console.log("duration ", duration);
                let audioMsg = {identifier: "", message: '', messageType: '', displayMsg: "", audio: { file: '', duration: '', play: false }, type: 'received', time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: Date.now(), readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" }
                audioMsg.audio = { file: data.output?.audio, duration: '10', play: false }
                audioMsg.messageType = 'audio';
                audioMsg.displayMsg=data.output?.text
                // this.ngZone.run(() => {
                  console.log('audio recieved',audioMsg.audio)
                  this.botMessages.push(audioMsg);
                  // this.saveChatMessage(audioMsg);
                  console.log('array',this.botMessages)
                 this.scrollToBottom();
                  // this.content.scrollToBottom(300).then(() => {
                  //   this.content.scrollToBottom(300).then()
                  // });
                // })
              }
              // this.content.scrollToBottom(300).then(() => {
              //   this.content.scrollToBottom(300).then()
              // });
            // }
          }
        } else {
          // msg.message = result.errorMesg ? result.errorMesg : result.data?.detail ? result.data.detail : "An unknown error occured, please try after sometime";
          // msg.displayMsg = msg.message;
          // msg.time = new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'});
          // msg.timeStamp = Date.now();
          // this.saveChatMessage(msg);
          this.disabled = false;
        }
      // })
    })
    // catch(e => {
    //   this.disabled = false;
    //   console.log('catch error ', e);
    //   this.botMessages[index-1].message = "An unknown error occured, please try after sometime";
    //   this.botMessages[index-1].displayMsg = "An unknown error occured, please try after sometime";
    //   this.botMessages[index-1].time = new Date().toLocaleTimeString('en', {hour: '2-digit', minute:'2-digit'});
    //   this.botMessages[index-1].timeStamp = Date.now();
    //   if(e.body.detail.length > 0) {
    //     if (e.body.detail[0].type === 'type_error.enum') {
    //       this.botMessages[index-1].message = "Sorry, this language is not currently supported.";
    //       this.botMessages[index-1].displayMsg = "Sorry, this language is not currently supported.";
    //     }
    //   }
    //   // this.saveChatMessage(this.botMessages[index-1]);
    // })
  }


  startRecording() {
    if (!this.isRecording) {
      this.isRecording = true;
      this.audioRecordingService.startRecording();
    }
  }

  abortRecording() {
    if (this.isRecording) {
      this.isRecording = false;
      this.audioRecordingService.abortRecording();
    }
  }

  stopRecording() {
    if (this.isRecording) {
      this.audioRecordingService.stopRecording();
      this.isRecording = false;
    }
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  playAudio(index) {
    const audio = new Audio();
    audio.src =  this.botMessages[index].audio.file? this.botMessages[index].audio.file:this.botMessages[index].audio.base64Data;
    audio.play();
  }

  scrollToBottom(): void {
    if (this.content) {
      this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
    }
  }
}