import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';
import { User } from '../models/user';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  private server: string;  
  private _httpHeaders: HttpHeaders;
  private headers;

  constructor(private _http:HttpClient, private tokenService: TokenService)
  {
    this.server = 'https://tasksapplication.herokuapp.com/api';
  }

  loginService(user: User)
  {
    return this._http.post(`${this.server}/signin`, user);
  }

  signupService(user: User)
  {
    return this._http.post(`${this.server}/signup`, user);
  }

  sendPasswordReset(user: User)
  {
    return this._http.post(`${this.server}/reset-password`, user);
  }

  changePassword(user: User)
  {
    return this._http.post(`${this.server}/change-password`, user);
  }

  getHeaders(){
    this._httpHeaders = new HttpHeaders().set('Authorization', `Bearer ${this.tokenService.getToken()}`);
    this.headers = { headers: this._httpHeaders};
    return this.headers;
  }

  closeAcount(email){
    return this._http.post(`${this.server}/close-acount`, email, this.getHeaders());
  }

}