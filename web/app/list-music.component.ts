import {Component, OnInit, EventEmitter, Output} from 'angular2/core';
import {Response}    from 'angular2/http';
import {Music} from './music.js';
import {MusicService} from './music.service.js';
import {User} from './user.js';

@Component({
    selector: 'list-music',
    template: `
        <h2>My Musics</h2>
        <ul id="playlist" class="musics">
            <li *ngFor="#music of musics"
                id="li{{music.id}}"
                [class.selected]="music === selectedMusic"
                (click)="onSelect(music)">
                <span class="badge"></span> {{music.filename}}
            </li>
        </ul>
    `,
    inputs: ['musics']
})

export class ListMusicComponent implements OnInit {
    public musics: Music[];
    public selectedMusic: Music;
    @Output() selectionChanged: EventEmitter = new EventEmitter();
    @Output() errorUserNotConnected: EventEmitter = new EventEmitter();

    constructor(private _musicService: MusicService) {}
    onSelect(music: Music) {
        this.selectedMusic = music;
        this.selectionChanged.emit(music);
    }
    getMusics() {
        this._musicService.getMusics().subscribe(
                musics => this.musics = musics,
                error => this.handleError(error));
    }
    handleError(error: Response) {
        //alert(error.status+': '+error.statusText);
        if (error.status == 401) {
            var data = error.json().data;
            var user = new User(data.last_username, '', false);
            this.errorUserNotConnected.emit(user);
        }
    }
    ngOnInit() {
        this.getMusics();
    }
}
