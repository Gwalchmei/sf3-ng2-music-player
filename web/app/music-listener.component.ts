import {Component, OnChanges, SimpleChange, EventEmitter, Output} from 'angular2/core';
import {Music} from './music.js';
import {BASEURL} from './base-url.js';
import {MusicService} from './music.service.js';

@Component({
    selector: 'music-listener',
    template: `
        <audio (ended)="onEnded($event)"
            (durationchange)="onDurationChanged($event)"
            (timeupdate)="onTimeUpdate($event)"
            class="hidden"
        >
            <source src="{{baseSrc}}{{music.id}}" type="audio/mp3" (error)="onSourceError($event)">
        </audio>
        <div class="row">
            <div *ngIf="audio" class="col-xs-6 col-sm-4">
                <div class="btn-group btn-group-xs btn-group-justified">
                    <div (click)="previous()" class="btn btn-default">
                        <span class="glyphicon glyphicon-fast-backward"></span>
                    </div>
                    <div (click)="playPause()" class="btn btn-default">
                        <span class="glyphicon" [class.glyphicon-pause]="!audio.paused" [class.glyphicon-play]="audio.paused"></span>
                    </div>
                    <div (click)="repeatMusic()" class="btn btn-default">
                        <span class="glyphicon glyphicon-repeat"></span>
                    </div>
                    <div (click)="next()" class="btn btn-default">
                        <span class="glyphicon glyphicon-fast-forward"></span>
                    </div>
                    <div class="btn btn-default" (click)="mute()">
                        <span class="glyphicon" [class.glyphicon-volume-up]="audio.muted" [class.glyphicon-volume-off]="!audio.muted"></span>
                    </div>
                </div>
            </div>
            <div class="col-xs-6 col-sm-8">
                <div id="volumeBar" class="progress progress-xs" (mousedown)="onVolumeDowned($event)" (mouseup)="onVolumeUpped($event)" (mousemove)="onVolumeDragged($event)">
                    <div class="progress-bar progress-bar-danger" style="width: {{volume}}%;"></div>
                </div>
            </div>
            <div class="col-xs-12">
                <div class="progress progress-lg">
                    <div
                        class="progress-bar progress-bar-striped progress-bar-info"
                        [class.active]="!audio.paused"
                        role="progressbar"
                        style="width: {{ratio}}%;"
                    ></div>
                </div>
            </div>
        </div>
        <div *ngIf="errorMessage">{{errorMessage}}</div>
    `,
    inputs: ['music'],
    styles: [`
        .progress-xs {
            height: 22px;
            margin-bottom: 0px;
        }

        .progress-lg {
            height: 40px;
            margin-top: 20px;
        }
    `]

})
export class MusicListenerComponent implements OnChanges {
    public music: Music;
    public baseSrc = BASEURL+"music/stream/";
    public audio: HTMLAudioElement;
    public volumeBarOffset: number;
    public volumeBarWidth: number;
    public errorMessage;
    public currentTime: number;
    public duration: number;
    public ratio: number;
    public volume: number;
    private _volumeDrag: boolean = false;
    @Output() nextAsked: EventEmitter<Music> = new EventEmitter();
    @Output() previousAsked: EventEmitter<Music> = new EventEmitter();

    constructor(private _musicService: MusicService) {}
    onEnded() {
        this.next();
    }

    onSourceError(event) {
        this.errorMessage = "An error occured while loading the audio source. You may not have the authorization to listen this song or the song may habe been deleted";
    }

    onDurationChanged(event) {
        if (this.music.duration === null) {
            var newDuration = event.target.duration;
            if (isFinite(newDuration) && newDuration > 0) {
                this.duration = parseFloat(newDuration.toFixed(2));
                this.music.duration = this.duration;
                this._musicService.updateMusic(this.music);
            }
        }
    }

    onTimeUpdate(event) {
        this.currentTime = parseFloat(event.target.currentTime.toFixed(2));

        this.ratio = (this.currentTime/this.duration) * 100;
    }

    playPause() {
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    }

    repeatMusic() {
        this.audio.load();
        this.audio.play();
    }

    previous() {
        this.previousAsked.emit(this.music);
    }

    next() {
        this.nextAsked.emit(this.music);
    }

    mute() {
        if (this.audio.muted) {
            this.audio.muted = false;
            this.volume = this.audio.volume*100;
        } else {
            this.audio.muted = true;
            this.volume = 0;
        }
    }

    onVolumeDowned(event) {
        this._volumeDrag = true;
        this.audio.muted = false;
        this.updateVolume(event.pageX);
    }

    onVolumeUpped(event) {
        if (this._volumeDrag) {
            this._volumeDrag = false;
            this.updateVolume(event.pageX);
        }
    }


    onVolumeDragged(event) {
        if (this._volumeDrag) {
            this.updateVolume(event.pageX);
        }
    }

    updateVolume(x) {
        if (this.volumeBarOffset === undefined) {
            var volumeBar = document.getElementById('volumeBar');
            this.volumeBarOffset = volumeBar.getBoundingClientRect().left;
            this.volumeBarWidth = volumeBar.offsetWidth;
        }
        var position = x - this.volumeBarOffset;
        this.volume = 100 * position / this.volumeBarWidth;
        if (this.volume > 100) {
            this.volume = 100;
        } else if (this.volume < 0) {
            this.volume = 0;
        }
        this.audio.volume = this.volume/100;
    }

    updateSources() {
        this.errorMessage = null;
        if (this.audio === undefined) {
            this.audio = document.getElementsByTagName('audio')[0];
        }
        this.volume = this.audio.volume*100;
        this.audio.load();
        this.duration = this.music.duration === null ? 200 : this.music.duration;
        this.audio.play();
    }

    ngOnChanges(changes: {[propName: string]: SimpleChange}) {
        this.updateSources();
    }
}
