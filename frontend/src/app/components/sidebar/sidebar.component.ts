import { Component, OnInit } from "@angular/core";
import { SidebarItem } from "@app/models/sidebarItem";
import { Router } from "@angular/router";
import { faSignOut } from "@fortawesome/pro-light-svg-icons";
import { AuthService } from "@app/services/auth.service";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
  // array of available sidebar navigation items
  sideBarItems: SidebarItem[];

  openSidebar: boolean;

  faSignOut = faSignOut;

  constructor(
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.sideBarItems = [];

    this.sideBarItems.push(
      new SidebarItem(0, "Breaks", "coffeebreaks"),
      new SidebarItem(1, "My Breaks", "coffeebreaks/true"),
      new SidebarItem(3, "Profile", "/profile")
    );

    if (this.authService.loggedInState) {
      console.log("logged in");
      this.openSidebar = true; // Opens the sidebar as default
    }
  }

  /**
   * Logs out the currently logged in user
   */
  logout(): void {
    this.authService.logout().subscribe(res => {
      //Overwriting route protection to be enabled
      this.authService.saveLoggedInState(false);

      if (res.success) {
        this.router.navigate(["/login"]);
        localStorage.removeItem("authJWT");
      } else {
        this.router.navigate(["/login"]);
        localStorage.removeItem("authJWT");
        //Show Toast Msg
        this.openSnackBar(
          "Something went wrong, you were logged out automatically"
        );
      }
    });
  }

  openSnackBar(msg) {
    this._snackBar.open(msg, "", {
      duration: 3000
    });
  }
}
