import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Message } from "@app/models/message.model";

@Injectable({
  providedIn: "root"
})
export class MessageboardService {
  private apigatewayURL = "https://localhost:4201/v1";
  private httpOptions = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("authJWT")
  });

  constructor(private http: HttpClient) {
    //inject httpClient
  }

  // Basic method for posting a Message
  public postMessage(message: Message): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http.post(
      `${this.apigatewayURL}/coffeebreak/message`,
      message,
      {
        headers: this.httpOptions
      }
    );
  }

  public getMessages(id: number): Observable<any> {
    this.httpOptions = this.httpOptions.set(
      "Authorization",
      "Bearer " + localStorage.getItem("authJWT")
    );
    return this.http.get(
      this.apigatewayURL + "/coffeebreak/messages?id=" + id,
      {
        headers: this.httpOptions
      }
    );
  }
}
