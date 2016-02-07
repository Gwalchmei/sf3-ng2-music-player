import {Component, OnInit} from 'angular2/core';
import {HTTP_PROVIDERS, Response, Http}    from 'angular2/http';
import {Music} from './music.js';
import {MusicService} from './music.service.js';
import {Playlist} from './playlist.js';
import {PlaylistService} from './playlist-service.js';
import {MusicListenerComponent} from './music-listener.component.js';
import {LoginFormComponent} from './login-form.component.js';
import {User} from './user.js';
import {ListMusicComponent} from './list-music.component.js';
import {BASEURL} from './base-url.js';

@Component({
    selector: 'my-app',
    template: `
        <div *ngIf="user">
            <div *ngIf="!user.connected">
                <login-form [user]="user" (connectionSuccess)="updateUser($event)"></login-form>
            </div>
            <div *ngIf="user.connected">
                <nav class="navbar navbar-default navbar-fixed-top">
                    <div class="container-fluid">
                        <div class="navbar-header">
                            <a class="navbar-brand" href="{{BASEURL}}">MusicPlayer</a>
                        </div>
                        <div class="nav navbar-nav">
                            <span class="navbar-text">Signed in as {{user.username}}</span>
                            <button (click)="logout()" class="btn btn-default navbar-btn">Logout</button>
                        </div>
                    </div>
                </nav>
                <div class="row-fluid">
                    <list-music
                        class="col-sm-6"
                        (selectedMusicChanged)="onMusicSelect($event)"
                        (selectedPlaylistChanged)="onPlaylistSelect($event)"
                        [playlists]="playlists"
                        [musics]="musics"
                        [selectedMusic]="selectedMusic"
                    ></list-music>
                    <div *ngIf="selectedMusic" class="col-sm-6">
                        <div class="row-fluid">
                            <music-listener
                                [music]="selectedMusic"
                                (musicEnded)="onMusicEnd($event)"
                            ></music-listener>
                        </div>
                        <div class="row-fluid">
                            {{ selectedMusic.name }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,
    directives: [MusicListenerComponent, LoginFormComponent, ListMusicComponent],
    providers: [HTTP_PROVIDERS, MusicService, PlaylistService]
})
export class AppComponent implements OnInit{
    public playlists: Playlist[];
    public musics: Music[];
    public selectedMusic: Music;
    public user: User;
    private _usernameUrl = BASEURL+'login_success';
    private _logoutUrl = BASEURL+'logout';

    constructor(private _http: Http, private _musicService: MusicService, private _playlistService: PlaylistService){}

    onMusicSelect(music: Music) {
        this.selectedMusic = music;
    }

    onPlaylistSelect(playlist: Playlist) {
        if (playlist === undefined) {
            this._musicService.loadMusics();
        } else {
            this._musicService.loadMusics(playlist.id);
        }
    }

    onMusicEnd(music: Music) {
        var indexOfNext = this.musics.indexOf(music)+1;
        if (indexOfNext == this.musics.length) {
            this.selectedMusic = this.musics[0];
        } else {
            this.selectedMusic = this.musics[indexOfNext];
        }
    }

    updateUser(user: User) {
        this.user = user;
        if (this.user.connected) {
            this._playlistService.loadPlaylists();
        }
    }

    logout() {
        this._http.get(this._logoutUrl)
            .map(res => res.json())
            .subscribe(
                success => this.user.connected = false,
                error => alert('Unexpected error')
            );
    }

    ngOnInit() {
        this._http.get(this._usernameUrl)
            .map(res => res.json().data)
            .subscribe(
                success => this.updateUser(new User(success.username,'',true)),
                error => this.updateUser(new User('','',false))
            );
        this._playlistService.playlists$.subscribe(updatedPlaylists => this.playlists = updatedPlaylists);
        this._musicService.musics$.subscribe(updatedMusics => {this.musics = updatedMusics; this.selectedMusic = this.musics[0];});
    }
}
