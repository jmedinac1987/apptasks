import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TokenService } from './token.service';


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

  loginService(form)
  {
    return this._http.post(`${this.server}/signin`, form);
  }

  signupService(form)
  {
    return this._http.post(`${this.server}/signup`, form);
  }

  sendPasswordReset(form)
  {
    return this._http.post(`${this.server}/reset-password`, form);
  }

  changePassword(form)
  {
    return this._http.post(`${this.server}/change-password`, form);
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
