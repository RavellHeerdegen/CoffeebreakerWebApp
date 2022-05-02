import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { User } from "@app/models/user.model";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

@Injectable({
  providedIn: "root" //<-- makes this a singleton
})
export class AuthService {
  //TODO: Environment variables?
  private authServiceBaseUrl = "https://localhost:4201/v1";
  private httpOptions = new HttpHeaders();

  public currentUser: User;

  //For route protection
  public loggedInState: boolean;

  constructor(private http: HttpClient) {}

  loginUser(credentials: User): Observable<any> {
    //Because JWTs are stateless: Save the current username in client local storage?
    return this.http.post(this.authServiceBaseUrl + "/auth/login", credentials);
  }

  checkToken(): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http.get(this.authServiceBaseUrl + "/auth/checkToken", {
      headers: this.httpOptions
    });
  }

  logout(): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http.get(this.authServiceBaseUrl + "/auth/logout", {
      headers: this.httpOptions
    });
  }

  loadCurrentUser(): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http
      .get(this.authServiceBaseUrl + "/currentUser", {
        headers: this.httpOptions
      })
      .pipe(
        map((res: any) => {
          localStorage.setItem("authJWT", res.authtoken);
          const user = res.currentUser;

          this.currentUser = new User(
            user.id,
            user.username,
            "",
            user.email,
            user.interests,
            user.coffeeType,
            user.profilePicture
          );
        })
      );
  }

  saveLoggedInState(val): void {
    this.loggedInState = val;
  }

  loadLoggedInState(): boolean {
    return this.loggedInState;
  }
}
