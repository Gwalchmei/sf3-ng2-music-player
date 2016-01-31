import {Component, OnInit} from 'angular2/core';
import {HTTP_PROVIDERS, Response, Http}    from 'angular2/http';
import {Music} from './music.js';
import {MusicService} from './music.service.js';
import {MusicListenerComponent} from './music-listener.component.js';
import {LoginFormComponent} from './login-form.component.js';
import {User} from './user.js';
import {ListMusicComponent} from './list-music.component.js';
import {BASEURL} from './base-url.js';

@Component({
    selector: 'my-app',
    template: `
        <h1>{{title}}</h1>
        <div *ngIf="user">
            <div *ngIf="!user.connected">
                <login-form [user]="user" (connectionSuccess)="updateUser($event)"></login-form>
            </div>
            <div *ngIf="user.connected">
                <p>Hello {{user.username}}</p> <button (click)="logout()">Logout</button>
                <div *ngIf="selectedMusic">
                    <music-listener [music]="selectedMusic"></music-listener>
                </div>
                <list-music (selectionChanged)="onSelect($event)" (errorUserNotConnected)="updateUser($event)"></list-music>
            </div>
        </div>
    `,
    directives: [MusicListenerComponent, LoginFormComponent, ListMusicComponent],
    providers: [HTTP_PROVIDERS, MusicService],
})
export class AppComponent implements OnInit{
    public title = 'Music';
    public selectedMusic: Music;
    public user: User;
    private _usernameUrl = BASEURL+'login_success';
    private _logoutUrl = BASEURL+'logout';

    constructor(private _http: Http){}
    onSelect(music: Music) {
        this.selectedMusic = music;
    }

    updateUser(user: User) {
        console.log("hello");
        this.user = user;
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
    }
}
