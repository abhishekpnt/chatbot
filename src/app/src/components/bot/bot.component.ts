import { AfterViewInit, Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { BotMessage } from 'src/app/appConstants';
import { AudioRecordingService } from 'src/app/src/services/audio-recording.service';
import { BotApiService } from '../../services/bot-api.service';
import { LoginService } from '../../services/login.service';
import { TranslateService } from '@ngx-translate/core';
import { UtilService } from '../../services/util.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'bot-component',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.scss'],
})
export class BotComponent implements OnInit, AfterViewInit, OnDestroy {
  botMessages: Array<any> = [];
  textMessage: string = ''
  chat!: BotMessage;
  botStartTimeStamp = Date.now();
  public isUserSpeaking: boolean = false;
  isPlaying = false;
  isRecording = false;
  recordedTime;
  blobUrl;
  data;
  selectedLanguage;
  disabled: boolean = true;
  

  audioRef!: HTMLAudioElement;
  ngZone: any;
  audio = new Audio();

  @Input() config: any = {};
  @Output() botMessageEvent = new EventEmitter();
  @ViewChild('recordbtn', { read: ElementRef }) recordbtn: ElementRef | any;
  @ViewChild('content', { static: false }) content: ElementRef;
  // private recordedBlob$: Observable<any>;
  private recordedBlob$: Subscription;

  constructor(
    private audioRecordingService: AudioRecordingService, private botApiService: BotApiService,
    private sanitizer: DomSanitizer, private loginService: LoginService, private translate: TranslateService, public utils: UtilService
  ) {
    this.botMessages = [
      { identifier: "welcomeMessage", message: 'welcomeMessage', messageType: 'audio', type: 'received', audio: { file: '', duration: '', play: false, base64Data: 'https://ax2cel5zyviy.compat.objectstorage.ap-hyderabad-1.oraclecloud.com/sbdjb-kathaasaagara/audio-output-20240305-105232.mp3' }, displayMsg: "welcomeMessage", time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" }];
    this.playAudio(this.botMessages.length - 1)
    this.utils.removeItem('content_id');
    this.utils.removeItem('text');
  }

  ngOnInit() {
    this.translate.setDefaultLang(this.utils.getLanguage() || 'en');
    this.selectedLanguage = this.utils.getLanguage() || 'en';

    this.audioRecordingService.recordingFailed().subscribe(() => (this.isRecording = false));
    this.audioRecordingService.getRecordedTime().subscribe((time) => (this.recordedTime = time));
    if (!this.recordedBlob$) {
      this.recordedBlob$ = this.audioRecordingService.getRecordedBlob().subscribe(async (data) => {
        this.data = data;
        this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(data.blob)
        );
        console.log('=====1');
        await this.handleMessage();
      });
    }
  }

  ngAfterViewInit(): void {
  }

  async handleMessage() {
    this.chat = { identifier: "clickToListen", message: 'clickToListen', messageType: 'audio', displayMsg: "clickToListen", audio: { file: '', duration: '', play: false }, type: 'sent', time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" }
    this.chat.audio = { base64Data: this.data.base64Data };
    this.chat.timeStamp = Date.now();
    this.botMessages.push(this.chat);
    let fetchMsg = { identifier: "fetchMessage", message: 'fetchMessage', messageType: 'text', type: 'received', displayMsg: "fetchMessage", time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" };
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
    // Api call and response from bot, replace loading text
    let index = this.botMessages.length;
    let lang = await this.utils.getLanguage() || 'en'
    text = localStorage.getItem('text') ?? '';
    await this.botApiService.getBotMessage(text, audio, lang).subscribe({
      next: result => {
        console.log('-----', result)
        this.botMessages = JSON.parse(JSON.stringify(this.botMessages));
        if (result.conversation && result.content) {
          this.utils.setItem('content_id', result?.content?.content_id || '');
          this.utils.setItem('text', result?.content?.text || '');
          this.botMessages.pop();
          this.setBotResponse(result?.conversation?.audio, result?.conversation?.text, 'conversation');
          setTimeout(() => {
            this.setBotResponse(result?.content?.audio, result.content?.text, 'content');
            setTimeout(() => {
              this.scrollToBottom();
            }, 100); // Adjust this delay as needed
          }, 5000);
        } else {
          if (result?.conversation && !result?.content) {
            this.botMessages.pop();
            this.utils.setItem('content_id', result?.content?.content_id || '');
            this.utils.setItem('text', result?.content?.text || '');
            this.setBotResponse(result?.conversation?.audio, result?.conversation?.text, 'conversation');
          }
          if (result?.content && !result?.conversation) {
            this.botMessages.pop();
            this.setBotResponse(result?.content?.audio, result.content?.text, 'content');
          }
          this.scrollToBottom();
          setTimeout(() => {
            this.scrollToBottom();
          }, 500);
        }
      },
      error: e => {
        this.disabled = false;
        console.log('catch error ', e);
        let errorMsg = { identifier: "", message: 'errorMessage', messageType: 'text', type: 'received', displayMsg: "errorMessage", time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" };
        this.botMessages.pop();
        this.botMessages.push(errorMsg);
        this.scrollToBottom();
        setTimeout(() => {
          this.scrollToBottom();
        }, 500)
      },
      complete: () => {
        // this.disabled = false;
      }
    });
  }
  setBotResponse(audio, text, type) {
    let audioMsg = { identifier: "", message: '', messageType: '', contentId: false, displayMsg: "", audio: { file: '', duration: '', play: false }, type: 'received', time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: Date.now(), readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" }
    audioMsg.audio = { file: audio, duration: '10', play: false }
    audioMsg.messageType = 'audio';
    audioMsg.displayMsg = text;
    audioMsg.contentId = type === "content" ? true : false
    console.log('audio recieved', audioMsg.audio)
    this.botMessages.push(audioMsg);
    this.playAudio(this.botMessages.length - 1)
    console.log('array', this.botMessages)
    this.scrollToBottom();
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
    if (this.recordedBlob$) {
      this.recordedBlob$.unsubscribe(); // Unsubscribe to prevent memory leaks
    }
  }

  playAudio(index) {
    if (!this.isPlaying || this.audio.src !== this.botMessages[index].audio.file) {
      this.audio.src = this.botMessages[index].audio.file ? this.botMessages[index].audio.file : this.botMessages[index].audio.base64Data;
      this.audio.play();
      this.isPlaying = true;
      this.audio.addEventListener('ended', () => {
        this.isPlaying = false;
        this.disabled = false;
      });
    } else {
      if (this.isPlaying) {
        this.audio.pause();
        this.isPlaying = false;
        this.disabled = false;
      } else {
        this.audio.play();
        this.isPlaying = true;
        this.disabled = true;
      }
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

  logout() {
    this.loginService.logout();
    localStorage.clear();
    if (this.recordedBlob$) {
      this.recordedBlob$.unsubscribe(); // Unsubscribe to prevent memory leaks
    }
  }


  onLanguageChange() {
    let base64Audio = '';
    this.utils.setLanguage(this.selectedLanguage)
    this.translate.use(this.utils.getLanguage());
    if (this.selectedLanguage === 'kn') {
      base64Audio = 'https://ax2cel5zyviy.compat.objectstorage.ap-hyderabad-1.oraclecloud.com/sbdjb-kathaasaagara/audio-output-20240305-105331.mp3'  //kn welcome msg audio
    }
    else {
      base64Audio = 'https://ax2cel5zyviy.compat.objectstorage.ap-hyderabad-1.oraclecloud.com/sbdjb-kathaasaagara/audio-output-20240305-105232.mp3'
    }
    this.disabled = true;
    this.botMessages = [
      { identifier: "welcomeMessage", message: 'welcomeMessage', messageType: 'audio', type: 'received', audio: { file: '', duration: '', play: false, base64Data: base64Audio }, displayMsg: "welcomeMessage", time: new Date().toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' }), timeStamp: '', readMore: false, likeMsg: false, dislikeMsg: false, requestId: "" }];
    this.playAudio(this.botMessages.length - 1)

  }
}