import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { UserService } from '../../services/user.service';
import { Router } from "@angular/router";
import { TokenService } from "../../services/token.service";
import { SnotifyService } from "ng-snotify";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  public loggedIn: boolean;
  public user_name ={ udn: null, email: null};

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService,
    private userService: UserService,
    private notify: SnotifyService
  ) {}

  ngOnInit() {
    this.authService.authStatus.subscribe(value => {
      this.loggedIn = value;
      if (this.tokenService.isValidToken())
        this.user_name = this.tokenService.getUser();
    });        
  }
  closeAcount(event: MouseEvent){
    event.preventDefault();
    if (confirm("Realmente desea cerrar su cuenta?")) {
      this.userService.closeAcount(this.user_name.email).subscribe(response =>{
        this.serverResponse(response);        
      }, error => this.handdleError(error));
    }
  }

  serverResponse(response) {
    this.notify.success(response.message, { timeout: 3000 });
    this.tokenService.removeToken();
    this.authService.changeAuthStatus(false);
    this.router.navigate(["/login"]);
    this.hideMenu();
  }

  showMenu(event: MouseEvent){
    event.preventDefault();    
    document.getElementById("sidebar").classList.toggle("active");
  }

  logout(event: MouseEvent) {
    event.preventDefault();
    this.tokenService.removeToken();
    this.authService.changeAuthStatus(false);
    this.router.navigate(["/login"]);
    this.hideMenu();
  }

  hideMenu() {
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
