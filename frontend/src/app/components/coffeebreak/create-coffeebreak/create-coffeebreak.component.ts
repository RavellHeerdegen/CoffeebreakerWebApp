import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { Coffeebreak } from "@app/models/coffeebreak.model";
import { Tag } from "@app/models/tag.model";
import { CoffeebreakUser } from "@app/models/coffeebreak-user.model";

import { CoffeebreakService } from "@app/services/coffeebreak.service";
import { AuthService } from "@app/services/auth.service";

import { faClock } from "@fortawesome/pro-light-svg-icons";
import { faMapMarkerAlt } from "@fortawesome/pro-light-svg-icons";

@Component({
  selector: "app-create-coffeebreak",
  templateUrl: "./create-coffeebreak.component.html",
  styleUrls: ["./create-coffeebreak.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class CreateCoffeebreakComponent implements OnInit {
  faClock = faClock;
  faMapMarkerAlt = faMapMarkerAlt;

  coffeebreakForm = new FormGroup({
    title: new FormControl(""),
    date: new FormControl("", [Validators.required]),
    startTime: new FormControl("", [Validators.required]),
    endTime: new FormControl(""),
    location: new FormControl("", [Validators.required]),
    maxParticipants: new FormControl("", [Validators.required]),
    conversationTopics: new FormControl("", [Validators.required])
  });

  today = new Date();

  coffeebreakTags: Array<Tag>;

  constructor(
    private coffeebreakService: CoffeebreakService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.coffeebreakService.getAllTags().subscribe(res => {
      this.coffeebreakTags = res;
    });
  }

  createCoffeebreak(): void {
    const currentUser = this.authService.currentUser;
    const coffeebreakUser = new CoffeebreakUser(
      currentUser.id,
      currentUser.username,
      currentUser.interests,
      currentUser.coffeeType,
      currentUser.profilePicture
    );

    const formValues = this.coffeebreakForm.value;
    const coffeebreakNew = new Coffeebreak(
      0,
      formValues.title,
      formValues.location,
      null,
      null,
      formValues.maxParticipants
    );
    coffeebreakNew.calculateStartAndEndDateTime(
      formValues.date,
      formValues.startTime,
      formValues.endTime
    );
    coffeebreakNew.tags = formValues.conversationTopics;
    coffeebreakNew.users = new Array<CoffeebreakUser>();
    coffeebreakNew.users.push(coffeebreakUser);
    this.coffeebreakService.createCoffeebreak(coffeebreakNew).subscribe(res => {
      localStorage.setItem("authJWT", res.authtoken);
      this.router.navigate(["/coffeebreaks"]);
    });
  }
}
