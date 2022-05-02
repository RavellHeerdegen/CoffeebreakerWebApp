import { Component, OnInit } from "@angular/core";
import { SettingsService } from "@app/services/settings.service";
import { User } from "@app/models/user.model";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { AuthService } from "@app/services/auth.service";
import { faLongArrowLeft } from "@fortawesome/pro-light-svg-icons";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent {
  private registerTemp = {
    username: "",
    password: "",
    password2: "",
    email: "",
    interest: "",
    coffeeType: ""
  };

  private registerPhaseSwap = true;

  faLongArrowLeft = faLongArrowLeft;

  coffeeTypes = [
    { value: "Americano" },
    { value: "Latte Macchiato" },
    { value: "Espresso" },
    { value: "Cappucchino" },
    { value: "Mochaccino" },
    { value: "Frappuccino" }
  ];

  constructor(
    private settingsService: SettingsService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private authService: AuthService
  ) {}

  phaseTwo(): void {
    this.registerPhaseSwap = !this.registerPhaseSwap;
  }

  register(): void {
    const ref = this.registerTemp;

    if (ref.password === ref.password2) {
      const newUser = new User(
        0,
        ref.username,
        ref.password,
        ref.email,
        ref.interest,
        ref.coffeeType
      );

      this.settingsService.postSettings(newUser).subscribe((res: any) => {
        const registeredUserloginCredentials = new User(
          0,
          ref.username,
          ref.password
        );

        this.authService
          .loginUser(registeredUserloginCredentials)
          .subscribe(res => {
            //Best practice to store in LocalStorage
            localStorage.setItem("authJWT", res.token);

            this.authService.loadCurrentUser().subscribe(() => {
              this.openSnackBar("Welcome to Coffeebreaker");
              this.authService.saveLoggedInState(true);
              this.router.navigate(["/coffeebreaks"]);
            });
          });
      });
    } else {
      this.openSnackBar("Passwords must match!");
    }
  }

  backToLogin(): void {
    this.router.navigate(["/login"]);
  }

  cancel(): void {
    this.registerPhaseSwap = !this.registerPhaseSwap;
  }

  openSnackBar(msg) {
    this._snackBar.open(msg, "", {
      duration: 3000
    });
  }
}
