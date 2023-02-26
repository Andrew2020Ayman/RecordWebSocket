import { Injectable } from "@angular/core";
import { Observable, Observer, Subject } from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  isConnected = false;
  websocket:any;
  topic = 'topic1';
  message!: any;
  msgs = [];
  
  constructor() {}

  send() {
    //this.websocket.send(JSON.stringify({ message: this.message}));
    this.websocket.send(this.message);
    //this.msgs.unshift(this.message);
    //this.message = '';
  }

  receive(evt:any) {
    if(evt && evt.data) {
      console.log('evt.data', evt.data);
      let message = JSON.parse(evt.data);
      //this.msgs.unshift(message.message);
    }
  }

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