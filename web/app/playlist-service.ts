import {Injectable} from 'angular2/core';
import {Http} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import {Playlist} from './playlist.js';
import {BASEURL} from './base-url.js';

@Injectable()
export class PlaylistService {
    playlists$: Observable<Array<Playlist>>;
    private _playlistsObserver: any;
    private _dataStore: {
        playlists: Array<Playlist>
    };

    constructor(private _http: Http) {
        // Create Observable Stream to output our data
        this.playlists$ = new Observable(observer =>
            this._playlistsObserver = observer).share();

        this._dataStore = { playlists: [] };
    }

    loadPlaylists() {
        this._http.get(BASEURL+'playlist/').map(response => <Playlist[]> response.json().data).subscribe(playlists => {
            // Update data store
            this._dataStore.playlists = playlists;

            // Push the new list of playlists into the Observable stream
            this._playlistsObserver.next(this._dataStore.playlists);
        }, error => console.log('Could not load playlists.'));
    }
}
