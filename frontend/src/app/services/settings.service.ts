import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "@app/models/user.model";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root" //<-- makes this a singleton
})
export class SettingsService {
  //TODO: Environment variables?
  private userSettingsServiceBaseUrl = "https://localhost:4201/v1/user";
  private httpOptions: HttpHeaders;

  constructor(private http: HttpClient) {
    this.httpOptions = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("authJWT")
    });
  }

  readSettings(id: number): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http
      .get(this.userSettingsServiceBaseUrl + "?id=" + id, {
        headers: this.httpOptions
      })
      .pipe(
        map((res: any) => {
          localStorage.setItem("authJWT", res.authtoken);

          return new User(
            res.read.id,
            res.read.username,
            null,
            null,
            res.read.interests,
            res.read.coffeeType,
            res.read.profilePicture
          );
        })
      );
  }

  //Register
  postSettings(usersettings: User): Observable<any> {
    //No need to send token here (no headers)
    return this.http.post(this.userSettingsServiceBaseUrl, usersettings);
  }

  //Update user settings
  updateSettings(usersettings: User): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http.put(this.userSettingsServiceBaseUrl, usersettings, {
      headers: this.httpOptions
    });
  }

  //Is this needed? A user does not delete his entire settings, likely to not be reflected in UI. Can be cascade-deleted in database.
  deleteSettings(id: number): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http.delete(this.userSettingsServiceBaseUrl + "?id=" + id);
  }
}
