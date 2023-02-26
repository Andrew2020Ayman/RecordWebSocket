import {  Component, OnInit } from '@angular/core';
import { DomSanitizer } from "@angular/platform-browser";
import { AudioRecordingService } from 'src/app/core/services/audio-recording.service';
import { WebsocketService } from 'src/app/core/services/WebsocketService.service';


@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.scss']
})
export class RecordComponent implements OnInit {





  isRecording = false;
  recordedTime:any;
  blobUrl:any;
  teste:any;

  constructor(public websocketService:WebsocketService,
    private audioRecordingService: AudioRecordingService,
    private sanitizer: DomSanitizer) {
    this.websocketService.connect();

    this.audioRecordingService
    .recordingFailed()
    .subscribe(() => (this.isRecording = false));
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
    
  }

  ngOnDestroy(): void {
    this.abortRecording();
  }

  download(): void {
    console.log(this.teste);
   
    const url = window.URL.createObjectURL(this.teste.blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = this.teste.title;
    link.click();
  }
  
}
