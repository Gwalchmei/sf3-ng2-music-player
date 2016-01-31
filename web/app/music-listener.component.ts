import {Component, OnChanges, SimpleChange} from 'angular2/core';
import {Music} from './music.js';
import {BASEURL} from './base-url.js';

@Component({
    selector: 'music-listener',
    template: `
        <audio id="audio" controls (ended)="onEnded()" autoplay>
            <source id="sourceMp3" src="{{baseSrc}}{{music.filename}}" type="audio/mp3" (error)="onSourceError($event)">
        </audio>
        <div *ngIf="errorMessage">{{errorMessage}}</div>
    `,
    inputs: ['music']

})
export class MusicListenerComponent implements OnChanges {
    public music: Music;
    public baseSrc = BASEURL+"stream/";
    public errorMessage;

    onEnded() {
        var playlist = document.getElementById('playlist');
        var id = this.music.id+1 == playlist.childElementCount ? 0 : this.music.id+1;
        var next = document.getElementById('li'+id);
        next.click();
    }
    onSourceError(event) {
        this.errorMessage = "An error occured while loading the audio source. You may not have the authorization to listen this song or the song may habe been deleted";
    }
    updateSources() {
        this.errorMessage = null;
        var audio = document.getElementsByTagName('audio')[0];
        audio.load();
        audio.play();
    }
    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        this.updateSources();
    }
}
