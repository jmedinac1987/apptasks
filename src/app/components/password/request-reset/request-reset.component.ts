import { Component, OnInit, OnDestroy } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { SnotifyService } from 'ng-snotify';
import { User } from "../../../models/user";
import { Subscription } from "rxjs";

@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.css']
})
export class RequestResetComponent implements OnInit, OnDestroy {
  
  public subscription: Subscription;
  public showSpinner: boolean;
  public user: User = new User();
  public error = null;

  constructor(
    private userService: UserService, 
    private notify: SnotifyService
  )
  { }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onSubmit()
  { 
    this.showSpinner = true;       
    this.subscription = this.userService.sendPasswordReset(this.user).subscribe(
      data => this.handleResponse(data),              
      error => this.handleError(error));
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
  
  handleResponse(response)
  { 
    this.showSpinner = false;
    this.error = null;
    this.notify.success(response.message, {timeout:0});        
    this.user.email = null;
  }


}
