import {Component, OnInit, EventEmitter, Output} from 'angular2/core';
import {Response}    from 'angular2/http';
import {Music} from './music.js';
import {MusicService} from './music.service.js';
import {User} from './user.js';
import {Playlist} from './playlist.js';
import {PlaylistService} from './playlist-service.js';

@Component({
    selector: 'list-music',
    template: `
        <select class="form-control" title="Select a playlist">
            <option value="0" (click)="selectPlaylist()">All</option>
            <option *ngFor="#playlist of playlists" value="{{ playlist.id }}" (click)="selectPlaylist(playlist)">{{playlist.name}}</option>
        </select>
        <div id="playlist" class="list-group">
            <button *ngFor="#music of musics"
                class="list-group-item"
                [class.list-group-item-success]="music === selectedMusic"
                (click)="onSelect(music)">
                <span class="badge">{{music.id}}</span> {{music.name}}
            </button>
        </div>
    `,
    inputs: ['playlists', 'musics', 'selectedMusic']
})

export class ListMusicComponent {
    public playlists: Playlist[];
    public musics: Music[];
    public selectedMusic: Music;
    @Output() selectedMusicChanged: EventEmitter<Music> = new EventEmitter();
    @Output() selectedPlaylistChanged: EventEmitter<Playlist> = new EventEmitter();

    constructor() {}

    onSelect(music: Music) {
        this.selectedMusicChanged.emit(music);
    }

    selectPlaylist(playlist: Playlist)
    {
        this.selectedPlaylistChanged.emit(playlist);
    }
}
