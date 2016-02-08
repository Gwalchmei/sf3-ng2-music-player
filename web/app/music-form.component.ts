import {Component} from 'angular2/core';
import {NgForm}    from 'angular2/common';
import {Music} from './music.js';
import {MusicService} from './music.service.js'

@Component({
    selector: 'music-form',
    template: `
        <form #f="ngForm" (ngSubmit)="submit()">
            <label for="name">Name</label>
            <input type="text" [(ngModel)]="music.name" required>

            <label for="duration">Duration</label>
            <input type="duration" [(ngModel)]="music.duration" required disabled>

            <button type="submit">Update !</button>
        </form>
    `,
    inputs: ['music']
})

export class MusicFormComponent {
    public music: Music;
    constructor(private _musicService: MusicService) {}

    submit() {
        this._musicService.updateMusic(this.music);
    }
}
