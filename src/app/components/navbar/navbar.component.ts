import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { UserService } from "../../services/user.service";
import { Router } from "@angular/router";
import { TokenService } from "../../services/token.service";
import { SnotifyService } from "ng-snotify";
import { Subscription } from "rxjs";
import { User } from "../../models/user";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit, OnDestroy {
  public loggedIn: boolean;
  public menu: boolean = true;
  public subscription: Subscription;
  public user: User = new User();

  public stylesClassNavbarAndSidebar = {
    class: "navbar navbar-expand-lg navbar-dark bg-dark navbar fixed-Custom",
    classSidebar: "sidebar bg-light",
    classDrawer: "mat-drawer-backdrop"
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService,
    private userService: UserService,
    private notify: SnotifyService
  ) {}

  ngOnInit() {
    this.subscription = this.authService.authStatus.subscribe(value => {
      this.loggedIn = value;
      if (this.tokenService.isValidToken())
        this.user = this.tokenService.getUser();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  closeAcount(event: MouseEvent) {
    event.preventDefault();
    if (confirm("Realmente desea cerrar su cuenta?")) {
      this.userService.closeAcount(this.user.email).subscribe(
        response => {
          this.serverResponse(response);
        },
        error => this.handdleError(error)
      );
    }
  }

  serverResponse(response) {
    this.notify.success(response.message, { timeout: 3000 });
    this.tokenService.removeToken();
    this.authService.changeAuthStatus(false);
    this.router.navigate(["/login"]);
    this.hideMenuNavBar();
  }

  showAndHiddenMenuSideBar(event: MouseEvent) {
    event.preventDefault();
    this.menu = !this.menu;
    this.stylesClassNavbarAndSidebar.classSidebar = this.menu
      ? "sidebar bg-light"
      : "active sidebar bg-light";
    this.stylesClassNavbarAndSidebar.classDrawer = this.menu
      ? "mat-drawer-backdrop"
      : "mat-drawer-shown mat-drawer-backdrop";

    this.hideMenuNavBar();
  }

  logout(event: MouseEvent) {
    event.preventDefault();
    if (confirm("Desea cerrar su sesión?")) {
      this.tokenService.removeToken();
      this.authService.changeAuthStatus(false);
      this.router.navigate(["/login"]);
      this.hideMenuNavBar();
    }
  }

  hideMenuNavBar() {
    if (
      document.querySelectorAll("#navbarNav")[0].attributes[1].value ===
      "navbar-collapse collapse show"
    ) {
      document.querySelectorAll("#navbarNav")[0].attributes[1].value =
        "navbar-collapse collapse";
    }
  }

  handdleError(error) {
    if (error.status === 0) {
      this.notify.error(
        "Lo sentimos en este momento no podemos procesar su solicitud",
        { timeout: 0 }
      );
      return;
    }

    if (error.error.message === "Token invalido") {
      this.notify.error("No tienes autorización", { timeout: 5000 });
      this.tokenService.removeToken();
      this.authService.changeAuthStatus(false);
      this.router.navigate(["/login"]);
      return;
    }

    this.notify.error(`Error: ${error.error.message}`, { timeout: 5000 });
  }
}