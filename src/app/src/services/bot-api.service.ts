import { Injectable } from '@angular/core';
// import { config } from '../environments/environments.prod';
// import { TranslateService } from '@ngx-translate/core';
// import { ApiService } from '.';
// import { ApiHttpRequestType, ApiRequest } from './api/model/api.request';
// import { catchError, lastValueFrom, map, tap } from 'rxjs';
// import { ApiResponse } from './api/model/api.response';


@Injectable({
  providedIn: 'root'
})
export class BotApiService {

  constructor(
    // private apiService: ApiService,

  ) { }

  async getBotMessage(text: string, audio: string, botType: string, lang: any): Promise<any> {
    console.log('text ', text, text !== "");
    console.log('audio ', audio, audio !== "");
    // let botApiPath = 'api/activitybot/v1/query';
    // let req: any = {
    //   input: {},
    //   output: {
    //     format: text ? "text" : "audio"
    //   }
    // }
    // if (text !== "") {
    //   req.input = {
    //     language: lang,
    //     text: text
    //   }
    // } else if (audio !== "") {
    //   req.input = {
    //     language: lang,
    //     audio: audio
    //   }
    // }
    // if (botType !== "story") {
    //   req.input.audienceType = botType 
    // }
    // const apiRequest = new ApiRequest.Builder()
    //   .withHost(config.api.BASE_URL)
    //   .withPath(botApiPath)
    //   .withType(ApiHttpRequestType.POST)
    //   .withBearerToken(true)
    //   .withBody(req)
    //   .withLanguge(lang)
    //   .build()
    // return lastValueFrom(this.apiService.fetch(apiRequest).pipe(
    //   map((response: ApiResponse) => {
    //     return response;
    //   }),
    //   catchError((err) => {
    //     throw err;
    //   })
    // ));
  // }

  }


 
}