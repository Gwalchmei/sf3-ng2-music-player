import {Injectable} from 'angular2/core';
import {Http}       from 'angular2/http';
import {Music}      from './music.js';
import {Observable} from 'rxjs/Observable';
import {BASEURL} from './base-url.js';

@Injectable()
export class MusicService {
    constructor (private _http: Http) {}
    private _listUrl = BASEURL+'list/';
    getMusics () {
        return this._http.get(this._listUrl)
                    .map(res => <Music[]> res.json().data)
                    .catch(this.logAndPassOn);
    }

    private logAndPassOn (error: Error) {

        return Observable.throw(error);
    }
}
