import { Component, OnInit } from "@angular/core";
import { UserService } from "../../services/user.service";
import { TokenService } from "../../services/token.service";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";
import { SnotifyService } from "ng-snotify";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  showSpinner: boolean;

  private list_white_server_email: String[] = [
    "gmail",
    "hotmail",
    "yahoo",
    "outlook"
  ];

  public form = {
    email: null,
    displayName: null,
    password: null,
    password_confirmation: null
  };

  public error = [];

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private authService: AuthService,
    private notify: SnotifyService
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.showSpinner = true;
    if (this.validateEmail(this.form.email)) {
      this.userService
        .signupService(this.form)
        .subscribe(
          data => this.handleResponse(data),
          error => this.handleError(error)
        );
    } else {
      let message =
        "Lo sentimos :S, por favor suministre una cuenta email valida";
      this.notify.error(message, { timeout: 5000 });
      this.showSpinner = false;
    }
  }

  handleError(error) {
    this.showSpinner = false;
    if (error.status === 0) {
      this.notify.error(
        "Lo sentimos en este momento no podemos procesar su solicitud",
        { timeout: 0 }
      );
    } else {
      this.error = error.error.message;
      this.notify.error(`!: ${this.error}`, { timeout: 0 });
    }
  }

  handleResponse(data) {
    this.showSpinner = false;
    this.error = [];
    this.tokenService.handle(data.token);
    this.authService.changeAuthStatus(true);
    this.router.navigate(["/profile/task"]);
  }

  validateEmail(email) {
    let regular_expression = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (regular_expression.test(email)) {
      let emailString = email.split("@");
      let servidor_email = emailString[1].split(".");
      return this.list_white_server_email.indexOf(servidor_email[0]) > -1
        ? true
        : false;
    } else {
      return false;
    }
  }
}
