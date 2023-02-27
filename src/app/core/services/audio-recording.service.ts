import { Injectable } from "@angular/core";
import * as RecordRTC from "recordrtc";
import * as moment from "moment";
import { buffer, Observable, Subject } from "rxjs";
import { WebsocketService } from "./WebsocketService.service";

interface RecordedAudioOutput {
  blob: Blob;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class AudioRecordingService {
 
  private stream:any;
  private recorder:any;
  private interval:any;
  private startTime:any;
  private _recorded = new Subject<any>();
  private _recordingTime = new Subject<string>();
  private _recordingFailed = new Subject<string>();

  private arrBuffer = new Subject<string>();
  /* private websocketService:WebsocketService */
  constructor(private websocketService:WebsocketService) {}


  ngOnInit(): void {
    
  }

  getRecordedBlob(): Observable<RecordedAudioOutput> {
    return this._recorded.asObservable();
  }

  getRecordedTime(): Observable<string> {
    return this._recordingTime.asObservable();
  }

  recordingFailed(): Observable<string> {
    return this._recordingFailed.asObservable();
  }

  startRecording() {
    if (this.recorder) {
      // It means recording is already started or it is already recording something
      return;
    }
    this._recordingTime.next("00:00");
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then(s => {
        this.stream = s;
        this.record();
      })
      .catch(error => {
        this._recordingFailed.next('error');
      });
  }

  abortRecording() {
    this.stopMedia();
  }
  
  private record() {
  
    this.recorder = new RecordRTC.StereoAudioRecorder(this.stream, {
      type: "audio",
      mimeType: "audio/webm;codecs=pcm",
      sampleRate: 44100,
      desiredSampRate:16000,
      numberOfAudioChannels:1,
      timeSlice: 500,
      
      ondataavailable: async (blob) => {
        const arrayBuffer = await blob.arrayBuffer();
       //var arrayBuffer = new Blob([blob], { type: 'audio/raw'});
        this.websocketService.message = arrayBuffer;
        this.websocketService.send();
      },
    });
   
    this.recorder.record();
    this.startTime = moment();
    this.interval = setInterval(() => {
      const currentTime = moment();
      const diffTime = moment.duration(currentTime.diff(this.startTime));
      const time =
        this.toString(diffTime.minutes()) +
        ":" +
        this.toString(diffTime.seconds());
        this._recordingTime.next(time);
    }, 1000);
  }

  private toString(value: string | number) {
    let val = value;
    if (!value) val = "00";
    if (value < 10) val = "0" + value;
    return val;
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stop(
          async (blob: any) => {
          if (this.startTime) {
            const mp3Name = encodeURIComponent(
              "audio_" + new Date().getTime() + ".wav"
            );
            this.stopMedia();
            
            /* ---- */
            //const arrayBuffer = await blob.arrayBuffer();

            //var dataview = this.encodeRAW(blob); /* raw */
            //var audioBlob = new Blob([dataview], { type: 'audio/raw'});
          
            //const arrayBuff = await audioBlob.arrayBuffer();
            /* ---- */
            //console.log(typeof arrayBuffer);
            
            //this.websocketService.message = arrayBuffer;
            //this.websocketService.send();

            this._recorded.next({ blob: blob, title: mp3Name });
            //this._recorded.next(audioBlob);
           
          }
      
        },
        () => {
          this.stopMedia();
          this._recordingFailed.next('error');
          
        }
      );
    }
  
  }

  private stopMedia() {
    if (this.recorder) {
        console.log('recorder: ', this.recorder);
        
      this.recorder = null;
      clearInterval(this.interval);
      this.startTime = null;
      if (this.stream) {
        this.stream.getAudioTracks().forEach((track: { stop: () => any; }) => track.stop());
        this.stream = null;
      }
    }
  }

  
}


/* 

  mergeBuffers(recBuffers:any, recLength:any) {
    var result = new Float32Array(recLength);
    var offset = 0;
    for (var i = 0; i < recBuffers.length; i++) {
      result.set(recBuffers[i], offset);
      offset += recBuffers[i].length;
    }
    return result;
  }

floatTo16BitPCM(output:any, offset:any, input:any) {
    for (var i = 0; i < input.length; i++ , offset += 2) {
      var s = Math.max(-1, Math.min(1, input[i]));
      output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
    }
  }

  encodeRAW(samples:any) {
    var buffer = new ArrayBuffer(samples.length * 2);
    var view = new DataView(buffer);
    this.floatTo16BitPCM(view, 0, samples);
    return view;
  }

  
  blobToBase64(blob:any) {
    return new Promise((resolve, _) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
 */
