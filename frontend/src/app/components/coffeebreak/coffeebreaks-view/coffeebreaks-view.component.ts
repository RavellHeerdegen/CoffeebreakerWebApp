import { Component, OnInit } from "@angular/core";
import { CoffeebreakService } from "@app/services/coffeebreak.service";
import { Subject } from "rxjs";
// Models
import { Coffeebreak } from "@app/models/coffeebreak.model";

import { faPlus } from "@fortawesome/pro-light-svg-icons";

@Component({
  selector: "app-coffeebreaks-view",
  templateUrl: "./coffeebreaks-view.component.html",
  styleUrls: ["./coffeebreaks-view.component.scss"]
})
export class CoffeebreaksViewComponent implements OnInit {
  public clickedCoffeebreak: Coffeebreak;
  public changedCoffeebreak: Coffeebreak;
  isJoined: boolean = false;
  initializeMessagesEvent: Subject<void> = new Subject<void>();

  faPlus = faPlus;

  constructor(private coffeebreakService: CoffeebreakService) {}

  ngOnInit() {}

  coffeebreakDetailsClicked(coffeebreak: Coffeebreak) {
    if (coffeebreak) {
      this.getCoffeebreak(coffeebreak.id).then(response => {
        this.isJoined = this.clickedCoffeebreak.isJoined;

        // this.changedCoffeebreakJoined = this.clickedCoffeebreak;
      });
    }
    this.clickedCoffeebreak = null;
  }

  // get single coffeebreak with details, tags and users
  getCoffeebreak(id): Promise<any> {
    return new Promise((resolve, reject) => {
      this.coffeebreakService.getCoffeebreak(id).subscribe(res => {
        this.clickedCoffeebreak = res;
        setTimeout(() => resolve("done!"), 200);
      });
    });
  }

  changeCoffeebreakJoinedFlag(coffeebreak: Coffeebreak) {
    this.changedCoffeebreak = JSON.parse(JSON.stringify(coffeebreak));
    this.isJoined = coffeebreak.isJoined;
    setTimeout(() => this.initializeMessagesEvent.next(), 100);
  }
}
