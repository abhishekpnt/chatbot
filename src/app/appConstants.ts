export interface BotMessage {
    identifier: string;
    message: string;
    messageType: string;
    displayMsg: string;
    audio?: any;
    type: string;
    time: string;
    timeStamp: any;
    readMore: boolean;
    likeMsg: boolean;
    dislikeMsg: boolean;
    requestId: string;
}