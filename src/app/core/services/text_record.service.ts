import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TextRecordService {


    current_Text: BehaviorSubject<string> = new BehaviorSubject<string>('');
    current_TextObs: Observable<string> = this.current_Text.asObservable();
    
    constructor() {
        //this.changeLang('');
    }

    updateText(TextInput:string) {
        /* console.log('current: ' , this.current_Text.value);
        console.log('new: ' , TextInput); */
        let newText = this.current_Text.value + ' ' + TextInput;
        this.current_Text.next(newText.toString());
    }
    clearText(){
        this.current_Text.next('');
    }
}
