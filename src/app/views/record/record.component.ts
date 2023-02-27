import {  Component, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { AudioRecordingService } from 'src/app/core/services/audio-recording.service';
import { TextRecordService } from 'src/app/core/services/text_record.service';
import { WebsocketService } from 'src/app/core/services/WebsocketService.service';


@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {

  current_Text = '';

  isRecording = false;
  recordedTime:any;
  blobUrl:any;
  teste:any;

  constructor(public websocketService:WebsocketService,
    private audioRecordingService: AudioRecordingService,
    private text_recordService:TextRecordService,
    private sanitizer: DomSanitizer) {
    this.websocketService.connect();

    this.audioRecordingService
    .recordingFailed()
    .subscribe(() => (this.isRecording = false));

    //this.audioRecordingService. 
    this.audioRecordingService
      .getRecordedTime()
      .subscribe(time => (this.recordedTime = time));

      this.audioRecordingService.getRecordedBlob().subscribe(data => {
        this.teste = data;
        this.blobUrl = this.sanitizer.bypassSecurityTrustUrl(
          URL.createObjectURL(data.blob)
        );
      });

      
    }

  ngOnInit(): void {
    this.text_recordService.current_TextObs.subscribe({
      next:(res)=>{
        console.log('resss: ' , res);
        
        this.current_Text = res.toString();
      }
    })
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
  clearRecordedData() {
    this.blobUrl = null;
    this.text_recordService.clearText()
  }
  ngOnDestroy(): void {
    this.abortRecording();
  }

  download(): void {
    const url = window.URL.createObjectURL(this.teste.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = this.teste.title;
    link.click();
  }
  
}
