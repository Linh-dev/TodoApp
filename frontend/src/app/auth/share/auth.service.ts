import { Injectable,EventEmitter,Output } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { SignupRequestPayload } from '../sign-up/signup-request.payload';
import { Observable, throwError } from 'rxjs';
import {LoginRequest} from '../login/login-request.payload';
import {LoginResponse} from '../login/login-response.payload'
import { map } from 'rxjs/operators';
import { LocalStorageService } from 'ngx-webstorage';
import { LogoutPayload } from './logout.payload';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();

  logoutPayload : LogoutPayload

  constructor(private httpClient: HttpClient, private localStorage: LocalStorageService) {
    this.logoutPayload = {
      token: ''
    }
   }

  signup(signupRequestPayload: SignupRequestPayload): Observable<any>{
    return this.httpClient.post('http://localhost:8080/api/auth/signup', signupRequestPayload, {responseType: 'text'});
  }

  login(loginRequest: LoginRequest): Observable<boolean> {
    return this.httpClient.post<LoginResponse>('http://localhost:8080/api/auth/login', loginRequest)
    .pipe(map(data =>{
        this.localStorage.store('authenticationToken', data.authenticationToken);
        this.localStorage.store('username', data.username);
        this.localStorage.store('message', data.message);
        this.loggedIn.emit(true);
        return true;
    }));
  }

  logout() {
    this.logoutPayload.token = this.getJwtToken();
    this.httpClient.post('http://localhost:8080/api/auth/logout', this.logoutPayload,{ responseType: 'text' }).subscribe(data => {
      console.log(data);
    }, error => {
      throwError(error);
    })
    console.log(this.logoutPayload);
    this.localStorage.clear('authenticationToken');
    this.localStorage.clear('username');
    this.localStorage.clear('message');
  }

  getJwtToken(): string {
    return this.localStorage.retrieve('authenticationToken');
  }
  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }
}
