import { Component, OnInit } from "@angular/core";
import { User } from "@app/models/user.model";
import { SettingsService } from "@app/services/settings.service";
import { AuthService } from "@app/services/auth.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";
import { DomSanitizer } from "@angular/platform-browser";
import imageCompression from "browser-image-compression";
import { faPlus, faChevronDown } from "@fortawesome/pro-light-svg-icons";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"]
})
export class EditProfileComponent implements OnInit {
  private user = new User();
  private reader = new FileReader();
  private bChangePwd = false;

  faPlus = faPlus;
  faChevronDown = faChevronDown;

  pwTemp = {
    "newPW": "",
    "newPW2": ""
  };

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
    private authService: AuthService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    // console.log("local storage: ", localStorage.getItem("authJWT"));
    // this.authService.currentUser().subscribe(found => {
    //   localStorage.setItem("authJWT", found.authtoken);
    //   // console.log("current user", currentUser);
    //   this.read(found.currentUser.id);
    // });
    this.user = this.authService.currentUser;
  }

  // read(p_user?: number): void {
  //   const user = p_user || this.user.id;
  //   // console.log("variable user: ", user);

  //   this.settingsService.readSettings(user).subscribe(_res => {
  //     const res = _res.read;
  //     //Received a new token and refresh it in the browser
  //     localStorage.setItem("authJWT", _res.authtoken);

  //     this.user = new User(
  //       res.id,
  //       res.username,
  //       res.password,
  //       res.email,
  //       res.interests,
  //       res.coffeeType
  //     );

  //     // //For cancel function. Create new object because the same object cant be re-used because of ngModel databind referencing.
  //     // this._previous = new User(
  //     //   this.user.id,
  //     //   this.user.username,
  //     //   this.user.password,
  //     //   this.user.email,
  //     //   this.user.interests,
  //     //   this.user.coffeeType
  //     // );
  //   });
  // }

  saveProfile(): void {

    //If user wants password change modify payload
    if (this.bChangePwd) {
      if (this.pwTemp.newPW !== this.pwTemp.newPW2) {
        //Show Error Msg
        this.openSnackBar("passwords must match");
      } else {
        this.user.password = this.pwTemp.newPW;
        this._doSave();
      }
    } else {
      this._doSave();
    }
  }

  _doSave() {
    this.settingsService.updateSettings(this.user).subscribe(res => {

      //Token refresh
      localStorage.setItem("authJWT", res.authtoken);

      //Show Toast Msg
      this.openSnackBar("profile settings saved");

      //TODO: Navigate back to profile overview?
      // console.log("update response", res);
      this.authService.loadCurrentUser().subscribe(() => {
        this.router.navigate(["/profile"]);
      });
    });
  }

  changePassword() {
    this.bChangePwd = !this.bChangePwd;
  }

  cancel(): void {
    this.router.navigate(["/profile"]);
  }

  backtologin(): void {
    this.router.navigate(["/login"]);
  }

  openSnackBar(msg) {
    this._snackBar.open(msg, "", {
      duration: 3000
    });
  }

  handleFileSelect(evt) {
    const imageFile = evt.target.files[0];
    console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 0.5,
      //maxWidthOrHeight: 600,
      useWebWorker: false
      //maxIteration: 10
    };

    //JavaScript scoping... there's a better way with ES2015+ but I'm lazy
    const that = this;

    imageCompression(imageFile, options)
      .then(compressedFile => {
        console.log(
          `compressedFile size ${compressedFile.size / 1024 / 1024} MB`
        ); // smaller than maxSizeMB

        that.toBase64(compressedFile).then((res: string) => {
          const sanitizedRes = res.split("data:image/png;base64,")[1];
          // console.log("sanitized conversion", sanitizedRes);

          that.user.profilePicture = sanitizedRes;
          that.sanitizer.bypassSecurityTrustResourceUrl(
            "data:image/png;base64," + that.user.profilePicture
          );
        });
      })
      .catch(function (error) {
        console.log(error.message);
      });
  }

  toBase64(file) {
    return new Promise((resolve, reject) => {
      this.reader.readAsDataURL(file);
      this.reader.onload = () => resolve(this.reader.result);
      this.reader.onerror = error => reject(error);
    });
  }

  transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      "data:image/png;base64," + this.user.profilePicture
    );
  }
}
