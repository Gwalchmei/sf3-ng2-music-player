import {Injectable} from 'angular2/core';
import {Http}       from 'angular2/http';
import {Music}      from './music.js';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/share';
import {BASEURL} from './base-url.js';

@Injectable()
export class MusicService {
    musics$: Observable<Array<Music>>;
    private _lastPid: number;
    private _musicsObserver: any;
    private _dataStore: {
        musics: Array<Music>
    };

    constructor (private _http: Http) {
        this.musics$ = new Observable(observer =>
            this._musicsObserver = observer).share();

        this._dataStore = { musics: [] };
    }

    loadMusics(id?: number, page?: number) {
        var url = BASEURL+"music/?";
        if (id !== undefined) {
            url = url+"pid="+id+"&";
        }
        if (page !== undefined) {
            url = url+"page="+page+"&";
        }
        this._http.get(url).map(response => <Music[]> response.json().data).subscribe(musics => {
            // Update data store
            if (id === this._lastPid) {
                musics.forEach((music, i) => {this._dataStore.musics.push(music);})
            } else {
                this._dataStore.musics = musics;
            }
            this._lastPid = id;

            // Push the new list of musics into the Observable stream
            this._musicsObserver.next(this._dataStore.musics);
        }, error => console.log('Could not load musics.'));
    }
}
