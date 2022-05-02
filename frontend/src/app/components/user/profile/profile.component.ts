import { Component, OnInit, Input } from "@angular/core";
import { SettingsService } from "@app/services/settings.service";
import { Router } from "@angular/router";
import { User } from "@app/models/user.model";
import { AuthService } from "@app/services/auth.service";
import { DomSanitizer } from "@angular/platform-browser";
import {
  faEdit,
  faUser,
  faComment,
  faCoffee
} from "@fortawesome/pro-light-svg-icons";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"]
})
export class ProfileComponent implements OnInit {
  faEdit = faEdit;
  faUser = faUser;
  faComment = faComment;
  faCoffee = faCoffee;

  @Input() userId: number;

  private user = new User();

  constructor(
    // private settingsService: SettingsService,
    private authService: AuthService,
    private settingsService: SettingsService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    // console.log("local storage: ", localStorage.getItem("authJWT"));
    // this.authService.currentUser().subscribe(found => {
    //   localStorage.setItem("authJWT", found.authtoken);
    //   // console.log("current user", found.currentUser);
    //   this.read(found.currentUser.id);
    // });
    this.authService.loadCurrentUser().subscribe(() => {
      if (this.userId) {
        this.settingsService.readSettings(this.userId).subscribe(res => {
          this.user = res;
        });
      } else {
        this.user = this.authService.currentUser;
      }
    });
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
  //   });
  // }

  backtologin(): void {
    this.router.navigate(["/login"]);
  }

  editprofile(): void {
    this.router.navigate(["/editprofile"]);
  }

  transform() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      "data:image/png;base64," + this.user.profilePicture
    );
  }
}
