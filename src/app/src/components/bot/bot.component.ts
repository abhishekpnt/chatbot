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
  isPlaying = false;
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
  audio = new Audio();
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
      // console.log('=====', this.data.base64Data);
      this.handleMessage();
    });
  }

  ngAfterViewInit(): void {
  }

  async handleMessage() {
    this.chat = { identifier: "", message: this.data.base64Data, audio: this.data.base64Data, messageType: 'audio', type: 'sent', displayMsg: "Click to View", time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" }
    this.chat = { identifier: "", message: '', messageType: 'audio', displayMsg: "Click to Listen", audio: { file: '', duration: '', play: false }, type: 'sent', time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" }
    this.chat.audio = { base64Data: this.data.base64Data };
    this.chat.timeStamp = Date.now();
    this.botMessages.push(this.chat);
    let fetchMsg = { identifier: "", message: 'Fetching...', messageType: 'text', type: 'received', displayMsg: "Fetching...", time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" };
    this.botMessages.push(fetchMsg);
    this.scrollToBottom();
    setTimeout(() => {
      this.scrollToBottom();
    }, 500)
    await this.makeBotAPICall('', this.chat.audio.base64Data.replace(/^data:audio\/wav;base64,/, ''));
  }

  async makeBotAPICall(text: string, audio: string) {
    this.textMessage = "";
    this.disabled = true;
    // Api call and response from bot, replace laoding text
    let index = this.botMessages.length;
    // let lang = await this.storage.getData('lang');
    await this.botApiService.getBotMessage(text, audio, this.config.type, 'en').subscribe({
      next: result => {
        console.log('-----', result)
        this.botMessages = JSON.parse(JSON.stringify(this.botMessages));
                if (result.output) {
          let data = result;
          if (data?.output?.audio) {
            let audioMsg = { identifier: "", message: '', messageType: '', displayMsg: "", audio: { file: '', duration: '', play: false }, type: 'received', time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: Date.now(), readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" }
            audioMsg.audio = { file: data.output?.audio, duration: '10', play: false }
            audioMsg.messageType = 'audio';
            audioMsg.displayMsg = data.output?.text
            // this.ngZone.run(() => {
            console.log('audio recieved', audioMsg.audio)
            this.botMessages.pop();
            this.botMessages.push(audioMsg);
            // this.saveChatMessage(audioMsg);
            console.log('array', this.botMessages)
            this.scrollToBottom();
            setTimeout(() => {
              this.scrollToBottom();
            }, 500)
          } else {
            let errorMsg = { identifier: "", message: 'An unknown error occured, please try after sometime', messageType: 'text', type: 'received', displayMsg: "An unknown error occured, please try after sometime", time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" };
            this.botMessages.pop();
            this.botMessages.push(errorMsg);
            this.scrollToBottom();
            setTimeout(() => {
              this.scrollToBottom();
            }, 500)
            this.disabled = false;
          }
        }
        },
        error: e => {
          this.disabled = false;
          console.log('catch error ', e);
          let errorMsg = { identifier: "", message: 'An unknown error occured, please try after sometime', messageType: 'text', type: 'received', displayMsg: "An unknown error occured, please try after sometime", time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" };
          this.botMessages.pop();
          this.botMessages.push(errorMsg);
          this.scrollToBottom();
          setTimeout(() => {
            this.scrollToBottom();
          }, 500)
        }
       } );
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
    if (!this.isPlaying) {
      this.audio.src = this.botMessages[index].audio.file ? this.botMessages[index].audio.file : this.botMessages[index].audio.base64Data;

      this.audio.play();
      this.isPlaying = true
    }
    else {
      this.audio.pause();
      this.isPlaying = false
    }
  }

  scrollToBottom(): void {
    if (this.content) {
      const contentElement = this.content.nativeElement;
      contentElement.scrollTo({
        top: contentElement.scrollHeight,
        behavior: 'smooth'
      });
    }
  }
}