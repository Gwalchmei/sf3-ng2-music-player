import {Component} from 'angular2/core';
import {NgForm, FORM_DIRECTIVES}    from 'angular2/common';
import {Music} from './music.js';
import {MusicService} from './music.service.js';
import {Playlist} from './playlist.js';

@Component({
    selector: 'music-form',
    template: `
        <div class="row">
            <div class="col-xs-12">
                <form #f="ngForm" (ngSubmit)="submit()" class="form-inline">
                    <label for="name">Music name :</label>
                    <input type="text" [(ngModel)]="music.name" required class="form-control">
                    <button type="submit" class="btn btn-default">Update !</button>
                </form>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-xs-12">
                <div class="form-inline">
                    <select class="form-control">
                        <option [selected]="!_pid">Select a playlist</option>
                        <option *ngFor="#playlist of playlists" value="{{playlist.id}}" (click)="selectPlaylist(playlist.id)">{{playlist.name}}</option>
                    </select>
                    <button (click)="addToPlaylist()" class="btn btn-default">Add to playlist !</button>
                    <button (click)="removeFromPlaylist()" class="btn btn-danger" [class.disabled]="!selectedPlaylist.id">Remove from current playlist !</button>
                </div>
            </div>
        </div>
    `,
    inputs: ['music', 'playlists', 'selectedPlaylist'],
    directives: [FORM_DIRECTIVES]
})

export class MusicFormComponent {
    public music: Music;
    public playlists: Playlist[];
    public selectedPlaylist: Playlist;
    private _pid: number;
    constructor(private _musicService: MusicService) {}

    submit() {
        this._musicService.updateMusic(this.music);
    }

    selectPlaylist(pid: number) {
        this._pid = pid;
    }

    addToPlaylist() {
        if (this._pid !== undefined) {
            this._musicService.addToPlaylist(this.music.id, this._pid);
            this._pid = undefined;
        }
    }

    removeFromPlaylist() {
        if (this.selectedPlaylist.id !== undefined) {
            this._musicService.removeFromPlaylist(this.music.id);
        }
    }
}
