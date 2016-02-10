import {Injectable} from 'angular2/core';
import {Http, Headers} from 'angular2/http';
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

    createPlaylist(playlist: Playlist) {
        var params = "playlist[name]="+playlist.name;
        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');
        this._http.post(BASEURL+"playlist/", params, {headers: headers}).map(response => response.json()).subscribe(data => {
                this._dataStore.playlists.push(data);
                this._playlistsObserver.next(this._dataStore.playlists);
            }, error => console.log(error)
        );
    }

    deletePlaylist(playlist: Playlist) {
        this._http.delete(BASEURL+"playlist/"+playlist.id).map(response => response.json()).subscribe(data => {
            if (data == 'success') {
                this._dataStore.playlists.forEach((p, index) => {
                    if (p.id == playlist.id) {this._dataStore.playlists.splice(index, 1);}
                });
                this._playlistsObserver.next(this._dataStore.playlists);
            }
        })
    }
}
