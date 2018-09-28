import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../services/user.service';
import { TokenService } from '../../services/token.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { SnotifyService } from 'ng-snotify';
import { User } from "../../models/user";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  public subscription: Subscription;
  public user: User = new User();
  public error = null;
  public showSpinner: boolean;

  constructor(
    private userService: UserService, 
    private tokenService: TokenService, 
    private router:Router, 
    private authService: AuthService, 
    private notify: SnotifyService) 
  { }

  ngOnInit(){}

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
 
  onSubmit()
  { 
    this.showSpinner = true;
    this.subscription = this.userService.loginService(this.user).subscribe(
       data => this.handleResponse(data)
      ,error => this.handleError(error));
    
  }

  handleError(error)
  { 
    this.showSpinner = false;
    if (error.status === 0) {
      this.notify.error('Lo sentimos en este momento no podemos procesar su solicitud', {timeout:0});  
    }else{
      this.error = error.error.message;
    }    
  }

  handleResponse(data)
  { 
    this.showSpinner = false;
    this.error = null;
    this.tokenService.handle(data.token);
    this.authService.changeAuthStatus(true);
    this.router.navigate(['/profile/task']);
  }

}
