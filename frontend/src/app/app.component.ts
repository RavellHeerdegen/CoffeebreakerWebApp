import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  title = "coffeebreaker";
  localStorage: Storage;

  constructor(private router: Router) {
    this.localStorage = localStorage;
  }

  ngOnInit() {
    // do init at here for current route.

    setTimeout(() => {
      // console.log("Potentially tried to access protected route. automatically forwarded to Login");
      this.router.navigate(["/login"]);
    }, 1000);  //1s
  }
}

//{headers:this.httpOptions}
