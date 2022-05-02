import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Tag } from "@app/models/tag.model";

@Injectable({
  providedIn: "root"
})
export class NewsService {
  private coffeebreakServiceURL = "http://localhost:4206/v1";
  private httpOptions = new HttpHeaders({
    "Content-Type": "application/json",
    Authorization: "Bearer " + localStorage.getItem("authJWT")
  });

  constructor(private http: HttpClient) {
    //inject httpClient
  }

  public getNews(unformattedTags: Tag[]): Observable<any> {
    //   let tags = [];
    //   unformattedTags.forEach((item)=>{
    //     tags.push(item.name);
    //   });

    // let newTags = {
    // 	"tags":tags
    // }

    return this.http.post(
      `${this.coffeebreakServiceURL}/news`,
      unformattedTags,
      { headers: this.httpOptions }
    );
  }
}
