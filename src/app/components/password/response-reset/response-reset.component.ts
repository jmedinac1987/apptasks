import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { SnotifyService } from "ng-snotify";
import { UserService } from "../../../services/user.service";
import { User } from "../../../models/user";
import { Subscription } from "rxjs";

@Component({
  selector: "app-response-reset",
  templateUrl: "./response-reset.component.html",
  styleUrls: ["./response-reset.component.css"]
})
export class ResponseResetComponent implements OnInit, OnDestroy {
  public subscription: Subscription;
  public showSpinner: boolean;
  public error = null;
  public user: User = new User();

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
    private notify: SnotifyService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(
      params => (this.user.resetToken = params["token"])
    );
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }

  onSubmit() {
    this.showSpinner = true;
    this.subscription = this.userService
      .changePassword(this.user)
      .subscribe(
        data => this.handleResponse(),
        error => this.handleError(error)
      );
  }

  handleError(error) {
    this.showSpinner = false;
    this.error = error.error.message;
    this.notify.error(`! ${this.error}`, { timeout: 0 });
  }

  handleResponse() {
    this.showSpinner = false;
    this.error = null;
    let _router = this.router;
    this.user = new User();

    this.notify.confirm(
      "Perfecto!, ahora inicia sesión con la nueva contraseña",
      {
        buttons: [
          {
            text: "OK",
            action: toster => {
              _router.navigate(["/login"]);
              this.notify.remove(toster.id);
            }
          }
        ]
      }
    );
  }
}
