import {Component} from 'angular2/core';
import {NgForm, FORM_DIRECTIVES}    from 'angular2/common';
import {PlaylistService} from './playlist-service.js';
import {Playlist} from './playlist.js';

@Component({
    selector: 'playlist-form',
    template: `
        <div class="row">
            <div class="col-xs-12">
                <form #f="ngForm" (ngSubmit)="submit()" class="form-inline">
                    <label for="name">New playlist name :</label>
                    <input type="text" [(ngModel)]="playlist.name" required class="form-control">
                    <button type="submit" class="btn btn-default">Add !</button>
                </form>
            </div>
        </div>
    `,
    directives: [FORM_DIRECTIVES]
})

export class PlaylistFormComponent {
    public playlist: Playlist;
    constructor(private _playlistService: PlaylistService) {
        this.playlist = {id:null, name: null};
    }

    submit() {
        this._playlistService.createPlaylist(this.playlist);
        this.playlist = {id:null, name: null};
    }
}
