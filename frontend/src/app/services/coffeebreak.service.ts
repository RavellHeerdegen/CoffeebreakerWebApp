import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Coffeebreak } from "@app/models/coffeebreak.model";
import { CoffeebreakUser } from "@app/models/coffeebreak-user.model";
import { Tag } from "@app/models/tag.model";
import { map } from "rxjs/operators";
import { AuthService } from "@app/services/auth.service";

@Injectable({
  providedIn: "root"
})
export class CoffeebreakService {
  private apigatewayURL = "https://localhost:4201/v1";
  private httpOptions = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("authJWT")
  });

  constructor(private http: HttpClient, private authService: AuthService) {
    //inject httpClient
  }

  public clickedCoffeebreak: Coffeebreak;

  // create coffeebreak
  public createCoffeebreak(coffeebreak: Coffeebreak): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http.post(this.apigatewayURL + "/coffeebreak", coffeebreak, {
      headers: this.httpOptions
    });
  }

  public getCoffeebreak(id: number): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http
      .get(this.apigatewayURL + "/coffeebreak?id=" + id, {
        headers: this.httpOptions
      })
      .pipe(
        map((res: any) => {
          localStorage.setItem("authJWT", res.authtoken);
          const coffeebreak = new Coffeebreak(
            res.read.id,
            res.read.title,
            res.read.venue,
            res.read.startAt,
            res.read.endAt,
            res.read.maxParticipants
          );

          coffeebreak.tags = res.read.Tags.map(
            tag => new Tag(tag.id, tag.name)
          );

          coffeebreak.users = res.read.Users.map(
            user =>
              new CoffeebreakUser(
                user.id,
                user.username,
                user.interests,
                user.coffeeType,
                user.profilePicture
              )
          );

          if (this.checkCurrentUserIsJoined(coffeebreak)) {
            coffeebreak.isJoined = true;
          }

          return coffeebreak;
        })
      );
  }

  public addUserToCoffeebreak(
    user: CoffeebreakUser,
    coffeebreak: Coffeebreak
  ): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http.post(
      this.apigatewayURL + "/addCoffeebreakUser",
      { user, coffeebreak },
      { headers: this.httpOptions }
    );
  }

  public removeUserFromCoffeebreak(
    user: CoffeebreakUser,
    coffeebreak: Coffeebreak
  ): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http.post(
      this.apigatewayURL + "/removeCoffeebreakUser",
      { user, coffeebreak },
      { headers: this.httpOptions }
    );
  }

  /**
   * Returns all saved coffeebreaks in the database
   */
  public getAllCoffeeBreaks(): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http
      .get(this.apigatewayURL + "/allcoffeebreaks", {
        headers: this.httpOptions
      })
      .pipe(
        map((res: any) => {
          localStorage.setItem("authJWT", res.authtoken);
          const coffeebreaks = res.read.map(coffeebreakRead => {
            const coffeebreak = new Coffeebreak(
              coffeebreakRead.id,
              coffeebreakRead.title,
              coffeebreakRead.venue,
              coffeebreakRead.startAt,
              coffeebreakRead.endAt,
              coffeebreakRead.maxParticipants
            );

            coffeebreak.tags = coffeebreakRead.Tags.map(
              tag => new Tag(tag.id, tag.name)
            );

            coffeebreak.users = coffeebreakRead.Users.map(
              user =>
                new CoffeebreakUser(
                  user.id,
                  user.username,
                  user.interests,
                  user.coffeeType,
                  user.profilePicture
                )
            );

            if (this.checkCurrentUserIsJoined(coffeebreak)) {
              coffeebreak.isJoined = true;
            }

            return coffeebreak;
          });
          return coffeebreaks;
        })
      );
  }

  public getAllTags(): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http
      .get(this.apigatewayURL + "/tags", {
        headers: this.httpOptions
      })
      .pipe(
        map((res: any) => {
          localStorage.setItem("authJWT", res.authtoken);
          const coffeebreakTags = res.read.map(
            tag => new Tag(tag.id, tag.name)
          );

          return coffeebreakTags;
        })
      );
  }

  checkCurrentUserIsJoined(coffeebreak) {
    return !!coffeebreak.users.find(
      user => user.id == this.authService.currentUser.id
    );
  }
}
