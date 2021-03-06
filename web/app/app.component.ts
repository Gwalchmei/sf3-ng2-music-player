import {Component, OnInit} from 'angular2/core';
import {HTTP_PROVIDERS, Response, Http}    from 'angular2/http';
import {Music} from './music.js';
import {MusicService} from './music.service.js';
import {Playlist} from './playlist.js';
import {PlaylistService} from './playlist.service.js';
import {MusicListenerComponent} from './music-listener.component.js';
import {LoginFormComponent} from './login-form.component.js';
import {User} from './user.js';
import {ListMusicComponent} from './list-music.component.js';
import {MusicFormComponent} from './music-form.component.js';
import {BASEURL} from './base-url.js';
import {PlaylistFormComponent} from './playlist-form.component.js';

@Component({
    selector: 'my-app',
    template: `
        <div *ngIf="user">
            <nav class="navbar navbar-default navbar-fixed-top">
                <div class="container-fluid">
                    <div class="navbar-header">
                        <a class="navbar-brand" href="{{BASEURL}}">MusicPlayer</a>
                    </div>
                    <div class="nav navbar-nav">
                        <div *ngIf="user.connected">
                            <span class="navbar-text">Signed in as {{user.username}}</span>
                            <button (click)="logout()" class="btn btn-default navbar-btn">Logout</button>
                        </div>
                        <div *ngIf="!user.connected">
                            <login-form [user]="user" (connectionSuccess)="updateUser($event)"></login-form>
                        </div>
                    </div>
                </div>
            </nav>
            <div *ngIf="user.connected">
                <div class="row">
                    <list-music
                        class="col-sm-6"
                        (selectedMusicChanged)="onMusicSelect($event)"
                        (selectedPlaylistChanged)="onPlaylistSelect($event)"
                        (loadMoreAsked)="loadMore($event)"
                        [playlists]="playlists"
                        [musics]="musics"
                        [selectedMusic]="selectedMusic"
                    ></list-music>
                    <div class="col-sm-6">
                        <div *ngIf="selectedMusic">
                            <music-listener
                                [music]="selectedMusic"
                                (nextAsked)="onNextAsked($event)"
                                (previousAsked)="onPreviousAsked($event)"
                            ></music-listener>
                            <music-form [music]="selectedMusic" [playlists]="playlists" [selectedPlaylist]="selectedPlaylist"></music-form>
                            <hr>
                        </div>
                        <playlist-form [selectedPlaylist]="selectedPlaylist"></playlist-form>
                    </div>
                </div>
            </div>
        </div>
    `,
    directives: [MusicListenerComponent, LoginFormComponent, ListMusicComponent, MusicFormComponent, PlaylistFormComponent],
    providers: [HTTP_PROVIDERS, MusicService, PlaylistService]
})
export class AppComponent implements OnInit{
    public playlists: Playlist[];
    public selectedPlaylist: Playlist;
    public musics: Music[];
    public selectedMusic: Music;
    public user: User;
    private _usernameUrl = BASEURL+'login_success';
    private _logoutUrl = BASEURL+'logout';

    constructor(private _http: Http, private _musicService: MusicService, private _playlistService: PlaylistService){}

    onMusicSelect(music: Music)
    {
        this.selectedMusic = music;
    }

    onPlaylistSelect(playlist: Playlist)
    {
        this.selectedPlaylist = playlist;
        this.loadMusics(this.selectedPlaylist.id);
    }

    onNextAsked(music: Music)
    {
        var indexOfNext = this.musics.indexOf(music)+1;
        var musicLength = this.musics.length;
        if (indexOfNext < musicLength) {
            this.selectedMusic = this.musics[indexOfNext];
            if ((musicLength%20 === 0) && (musicLength-indexOfNext < 5)) {
                this.loadMore(musicLength);
            }
        } else {
            this.selectedMusic = this.musics[0];
        }

    }

    onPreviousAsked(music: Music)
    {
        var indexOfPrev = this.musics.indexOf(music)-1;
        var musicLength = this.musics.length;
        if (indexOfPrev < 0) {
            this.selectedMusic = this.musics[musicLength-1];
        } else {
            this.selectedMusic = this.musics[indexOfPrev];
        }
    }

    loadMore(length: number)
    {
        var page = Math.floor(length/20);
        this.loadMusics(this.selectedPlaylist.id, page);
    }

    loadMusics(pid?: number, page?: number)
    {
        this._musicService.loadMusics(pid, page);
    }

    updateUser(user: User)
    {
        this.user = user;
        if (this.user.connected) {
            this._playlistService.loadPlaylists();
        }
    }

    logout()
    {
        this._http.get(this._logoutUrl)
            .map(res => res.json())
            .subscribe(
                success => this.user.connected = false,
                error => alert('Unexpected error')
            );
    }

    updateMusics(updatedMusics) {
        if (this.selectedMusic !== undefined) {
            var selectedMusic = this.selectedMusic;
            updatedMusics.forEach(function(music){
                if (selectedMusic.id == music.id) {
                    selectedMusic = music;
                }
            });
            this.selectedMusic = selectedMusic;
        }
        this.musics = updatedMusics;
    }

    ngOnInit()
    {
        this._http.get(this._usernameUrl)
            .map(res => res.json().data)
            .subscribe(
                success => this.updateUser(new User(success.username,'',true)),
                error => this.updateUser(new User('','',false))
            );
        this._playlistService.playlists$.subscribe(updatedPlaylists => this.playlists = updatedPlaylists);
        this._musicService.musics$.subscribe(updatedMusics => this.updateMusics(updatedMusics));
    }
}
