import {
  Component,
  Inject,
  OnInit,
  Input,
  Output,
  EventEmitter
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA
} from "@angular/material/dialog";
import { DomSanitizer } from "@angular/platform-browser";

export interface ForeignProfileData {
  user: User;
}

import { CoffeebreakService } from "@app/services/coffeebreak.service";
import { AuthService } from "@app/services/auth.service";

// Models
import { Coffeebreak } from "@app/models/coffeebreak.model";
import { User } from "@app/models/user.model";
import { CoffeebreakUser } from "@app/models/coffeebreak-user.model";

// Icons
import {
  faMapMarkerAlt,
  faCalendar,
  faClock,
  faTimes
} from "@fortawesome/pro-light-svg-icons";
import { faUser as faSolidUser } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-coffeebreak-details",
  templateUrl: "./coffeebreak-details.component.html",
  styleUrls: ["./coffeebreak-details.component.scss"]
})
export class CoffeebreakDetailsComponent implements OnInit {
  // Icons
  faMapMarkerAlt = faMapMarkerAlt;
  faCalendar = faCalendar;
  faClock = faClock;
  faSolidUser = faSolidUser;

  options = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  };

  @Input() coffeebreak: Coffeebreak;
  @Output() changeCoffeebreakJoinedFlagEvent = new EventEmitter<Coffeebreak>();

  constructor(
    private authService: AuthService,
    private coffeebreakService: CoffeebreakService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private sanitizer: DomSanitizer
  ) {
    this.route.params.subscribe(params => {
      if (params["id"]) {
        this.getCoffeebreak(params["id"]);
      }
    });
  }

  ngOnInit() {}

  transform(user: CoffeebreakUser) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      "data:image/png;base64," + user.profilePicture
    );
  }

  // get single coffeebreak with details, tags and users
  getCoffeebreak(id): void {
    this.coffeebreakService.getCoffeebreak(id).subscribe(res => {
      this.coffeebreak = res;
    });
  }

  convertNumberToArray(num) {
    return new Array(num);
  }

  joinCoffeebreak() {
    const currentUser = this.authService.currentUser;
    const userToAdd = new CoffeebreakUser(
      currentUser.id,
      currentUser.username,
      currentUser.interests,
      currentUser.coffeeType,
      currentUser.profilePicture
    );
    this.coffeebreakService
      .addUserToCoffeebreak(userToAdd, this.coffeebreak)
      .subscribe(res => {
        localStorage.setItem("authJWT", res.authtoken);
        this.coffeebreak.users = res.read.Users.map(
          user =>
            new CoffeebreakUser(
              user.id,
              user.username,
              user.interests,
              user.coffeeType,
              user.profilePicture
            )
        );

        this.coffeebreak.isJoined = true;
        this.changeCoffeebreakJoinedFlagEvent.emit(this.coffeebreak);
      });
  }

  unjoinCoffeebreak() {
    const currentUser = this.authService.currentUser;
    const userToRemove = new CoffeebreakUser(
      currentUser.id,
      currentUser.username,
      currentUser.interests,
      currentUser.coffeeType,
      currentUser.profilePicture
    );
    this.coffeebreakService
      .removeUserFromCoffeebreak(userToRemove, this.coffeebreak)
      .subscribe(res => {
        localStorage.setItem("authJWT", res.authtoken);
        this.coffeebreak.users = res.read.Users.map(
          user =>
            new CoffeebreakUser(
              user.id,
              user.username,
              user.interests,
              user.coffeeType,
              user.profilePicture
            )
        );

        this.coffeebreak.isJoined = false;
        this.changeCoffeebreakJoinedFlagEvent.emit(this.coffeebreak);
      });
  }

  openDialog(user): void {
    this.dialog.open(ForeignProfileComponent, {
      width: "750px",
      data: { user: user }
    });
  }

  checkUserIconClass(coffeebreak: Coffeebreak, index: number) {
    if (index < coffeebreak.users.length) {
      if (coffeebreak.users[index].id === this.authService.currentUser.id) {
        return "solidUserIcon";
      } else {
        return "regularUserIcon";
      }
    } else {
      return "blankUserIcon";
    }
  }
}

@Component({
  selector: "app-foreign-profile",
  templateUrl: "./foreign-profile/foreign-profile.component.html",
  styleUrls: ["./foreign-profile/foreign-profile.component.scss"]
})
export class ForeignProfileComponent implements OnInit {
  faTimes = faTimes;

  constructor(
    public dialogRef: MatDialogRef<ForeignProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ForeignProfileData
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
