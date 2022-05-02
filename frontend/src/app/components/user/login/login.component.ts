import { Component } from "@angular/core";
import { AuthService } from "@app/services/auth.service";
import { Router } from "@angular/router";
import { User } from "@app/models/user.model";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar
  ) {}

  private loginCredentials = new User();

  login(): void {
    this.authService.loginUser(this.loginCredentials).subscribe(
      res => {
        //Best practice to store in LocalStorage
        localStorage.setItem("authJWT", res.token);

        this.authService.loadCurrentUser().subscribe(() => {
          this.router.navigate(["/coffeebreaks"]);
        });

        //Route protection now disabled
        this.authService.saveLoggedInState(true);
      },
      err => {
        //TODO: Error Handling
        console.log(err);

        //Overwriting route protection to be enabled
        this.authService.saveLoggedInState(false);

        //Show Toast Msg
        this.openSnackBar("Login failed. Please check your credentials");
      }
    );
  }

  toSignup(): void {
    this.router.navigate(["/register"]);
  }

  forgotPassword(): void {
    alert("Not implemented");
  }

  openSnackBar(msg) {
    this._snackBar.open(msg, "", {
      duration: 3000
    });
  }
}
