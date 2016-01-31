import {Component, EventEmitter, Output} from 'angular2/core';
import {NgForm}    from 'angular2/common';
import {Http, Headers} from 'angular2/http';
import {BASEURL} from './base-url.js';
import {User} from './user.js';

@Component({
    selector: 'login-form',
    inputs: ['user'],
    template: `
        <form #f="ngForm" (ngSubmit)="authenticate()">
            <label for="username">Username</label>
            <input type="text" [(ngModel)]="user.username" required>

            <label for="password">Password</label>
            <input type="password" [(ngModel)]="user.password" required>

            <button type="submit">Login !</button>
        </form>
    `
})

export class LoginFormComponent {
    private _loginCheckUrl: string = BASEURL+'login_check';
    public user: User;
    @Output() connectionSuccess: EventEmitter = new EventEmitter();

    constructor(private _http: Http){}

    authenticate() {
        var creds = "_username=" + this.user.username + "&_password=" + this.user.password;

        var headers = new Headers();
        headers.append('Content-Type', 'application/x-www-form-urlencoded');

        this._http.post(this._loginCheckUrl, creds, {headers : headers})
            .map(response => response.json())
            .subscribe(
                success => this.onSuccess(success.data),
                err => this.onError(err)
        )
    }

    onSuccess(success) {
        console.log(success);
        if (success.login_state == 'success') {
            console.log("success");
            var user = new User(success.username, '', true);
            this.connectionSuccess.emit(user);
        }
    }

    onError(err) {
        alert(err.status);
    }
}
