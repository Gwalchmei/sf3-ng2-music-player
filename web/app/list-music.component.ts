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
        <select class="form-control">
            <option>Select a playlist</option>
            <option value="0" (click)="selectPlaylist()">All</option>
            <option *ngFor="#playlist of playlists" value="{{ playlist.id }}" (click)="selectPlaylist(playlist)">{{playlist.name}}</option>
        </select>
        <div id="playlist" class="list-group">
            <button *ngFor="#music of musics"
                class="list-group-item"
                [class.list-group-item-success]="music === selectedMusic"
                (click)="onSelect(music)">
                {{music.name}}
                <span class="badge">{{music.id}}</span>
                <span class="badge">{{music.duration}}</span>
            </button>
            <button *ngIf="musics"
                [class.disabled]="(musics.length === 0 || (musics.length % 20) !== 0)"
                class="list-group-item list-group-item-info"
                (click)="loadMore()"
            >Load more</button>
        </div>
    `,
    inputs: ['playlists', 'musics', 'selectedMusic'],
    styles: [`
        .list-group {
            max-height: calc(100vh - 124px);
            overflow: auto;
        }
    `]
})

export class ListMusicComponent {
    public playlists: Playlist[];
    public musics: Music[];
    public selectedMusic: Music;
    @Output() selectedMusicChanged: EventEmitter<Music> = new EventEmitter();
    @Output() selectedPlaylistChanged: EventEmitter<Playlist> = new EventEmitter();
    @Output() loadMoreAsked: EventEmitter<number> = new EventEmitter();
    constructor() {}

    onSelect(music: Music)
    {
        this.selectedMusicChanged.emit(music);
    }

    selectPlaylist(playlist: Playlist)
    {
        if (playlist === undefined) {
            playlist = {'id' : undefined, 'name' : undefined};
        }
        this.selectedPlaylistChanged.emit(playlist);
    }

    loadMore()
    {
        if (this.musics.length !== 0 && (this.musics.length % 20) === 0) {
            this.loadMoreAsked.emit(this.musics.length);
        }
    }
}
