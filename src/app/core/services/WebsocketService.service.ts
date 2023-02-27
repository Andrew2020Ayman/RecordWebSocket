import { Injectable } from "@angular/core";
import { Observable, Observer, Subject } from "rxjs";
import { AudioRecordingService } from "./audio-recording.service";
import { TextRecordService } from "./text_record.service";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  isConnected = false;
  websocket:any;
  topic = 'topic1';
  message!: any;
  msgs = [];
  
  /* private audioService:AudioRecordingService */
  constructor(private text_recordService:TextRecordService,) {}

  send() {
    this.websocket.send(this.message);
  }

  receive(evt:any) {
    if(evt && evt.data) {
      let result = evt.data;
      console.log('evt.data', result);
      const obj = JSON.parse(result);

      /* console.log('partial', obj.partial);
      if(obj.partial){
        var ret = obj.partial.replace('<UNK>','');
        if(ret.length > 0){
          this.text_recordService.updateText(ret)
        }
        */
       
        //let textResult = ResultArr.text;
        //console.log('result', textResult);
      if(obj.text){
        var ret = obj.text.replace('<UNK>','');
        if(ret.length > 0){
          this.text_recordService.updateText(ret)
        }
      }
   /*    let message = JSON.parse(evt.data);
      this.msgs.unshift(); */
    }
  }

  index = 1;
  connect() {
    let comp = this;
    this.websocket = new WebSocket('wss://asr-realtime.clearcypher.com/afow23csalp');
    this.websocket.onopen = (evt:any) =>{
      comp.isConnected = true;
      //comp.join();
      console.log('open', evt);
    };
    this.websocket.onclose = (evt:any) => {
      comp.isConnected = false;
      console.log('close', evt);
    };
    this.websocket.onmessage = (evt:any) =>{ comp.receive(evt); };
    this.websocket.onerror = (evt:any)=>{
      comp.isConnected = false;
      console.log('error', evt);
    };
  }

  disconnect() {
    this.websocket.close();
  }

  join() {
    this.websocket.send(JSON.stringify({join: this.topic}));
  }

}