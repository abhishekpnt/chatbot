import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BotMessage } from 'src/app/appConstants';
import { AudioRecordingService } from 'src/app/src/services/audio-recording.service';

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
  navigated: boolean = false
  duration = 0;
  durationDisplay = '';
  disabled = false;
  audioRef!: HTMLAudioElement;
  constructor(
    private audioRecordingService: AudioRecordingService,
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
    // if (this.textMessage.replace(/\s/g, '').length > 0) {
      // Keyboard.hide();
      // this.chat.message = this.textMessage;
      // this.chat.displayMsg = this.textMessage;
      // this.saveChatMessage(this.chat);
      // this.content.scrollToBottom(300).then(() => {
      //   this.content.scrollToBottom(300)
      // })
      // this.botMessages.push(this.defaultLoaderMsg);
      // this.content.scrollToBottom(300).then(() => {
      //   this.content.scrollToBottom(300)
      // })
      // await this.makeBotAPICall('',this.data.base64Data);
    // }
  }


  // getTimeString(duration: any) {
  //   let minutes = Math.floor(duration / 1000 / 60);
  //   let seconds = Math.floor((duration / 1000) - (minutes * 60));
  //   return minutes.toString().padStart(2, '0') + ":" + seconds.toString().padStart(2, '0');
  // }

  // fetchAudioDuration(url: string): Promise<any> {
  //   const audioContext = new AudioContext();
  //   return fetch(url)
  //     .then(response => response.arrayBuffer())
  //     .then(buffer => audioContext.decodeAudioData(buffer))
  //     .then(audioBuffer => {
  //       const duration = audioBuffer.duration;
  //       console.log(`The audio file duration is ${duration} seconds`);
  //       let minute = (Math.floor(duration / 60)).toString().padStart(2, '0');
  //       let seconds = Math.floor(duration % 60).toString().padStart(2, '0');
  //       return minute + ':' + seconds;
  //     }).catch(e => {
  //       return '';
  //     });
  // }


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

  playAudio() {
    const audio = new Audio();
    audio.src = this.chat.audio.base64Data;
    audio.play();
  }
}