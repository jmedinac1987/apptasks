import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { SnotifyService } from 'ng-snotify';



@Component({
  selector: 'app-request-reset',
  templateUrl: './request-reset.component.html',
  styleUrls: ['./request-reset.component.css']
})
export class RequestResetComponent implements OnInit {
  showSpinner: boolean;

  public form = {
    email: null
  } 
  
  public error = null;

  constructor(
    private userService: UserService, private notify: SnotifyService
  )
  { }

  ngOnInit() {
  }

  onSubmit()
  { 
    this.showSpinner = true;
    this.notify.info('Procesando la solicitud...', {timeout: 1000});    
    this.userService.sendPasswordReset(this.form).subscribe(
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
    this.form.email = null;
  }


}
