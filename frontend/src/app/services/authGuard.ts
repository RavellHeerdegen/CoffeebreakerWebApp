import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { AuthService } from "./auth.service";
import { MatSnackBar } from "@angular/material";

@Injectable()
export class CanActivateViaAuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) { }

  canActivate() {
    return new Promise<boolean>((resolve, reject) => {
      this.authService.checkToken().subscribe(res => {
        if (res.success) {
          //Token refresh
          localStorage.setItem("authJWT", res.token);
          resolve(true);
        } else {
          console.log("Tried to access protected route, automatically redirect to login");
          this.router.navigate(["/login"]);

          //Show Toast Msg
          this.openSnackBar("Please log in with your credentials");
        }
      });
    });
  }

  // //For route protection (Interface CanActivate)
  // canActivate() {
  //   //Get current loggedIn State
  //   const isLoggedIn = this.authService.loadLoggedInState();

  //   //In case of false redirect to login automatically
  //   if (!isLoggedIn) {
  //     console.log(
  //       "Tried to access protected route, automatically redirect to login"
  //     );
  //     this.router.navigate(["/login"]);
  //     localStorage.removeItem("authJWT");

  //     //Show Toast Msg
  //     this.openSnackBar("Please log in with your credentials");
  //   }

  //   return isLoggedIn;
  // }

  openSnackBar(msg) {
    this._snackBar.open(msg, "", {
      duration: 3000
    });
  }
}
