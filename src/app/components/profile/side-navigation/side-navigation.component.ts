import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-side-navigation",
  templateUrl: "./side-navigation.component.html",
  styleUrls: ["./side-navigation.component.css"]
})
export class SideNavigationComponent implements OnInit {
  constructor() {}

  ngOnInit() {
        
  }

  showMenu(event: MouseEvent){
    event.preventDefault();    
    document.getElementById("sidebar").classList.toggle("active");
    document.getElementById("mat-drawer").classList.toggle("mat-drawer-shown");
  }
}
