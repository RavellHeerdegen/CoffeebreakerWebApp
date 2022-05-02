import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";
import { NewsService } from "@app/services/news.service";
import { Coffeebreak } from "@app/models/coffeebreak.model";

@Component({
  selector: "app-news",
  templateUrl: "./news.component.html",
  styleUrls: ["./news.component.scss"]
})
export class NewsComponent implements OnInit, OnChanges {
  @Input() coffeebreak: Coffeebreak;

  private news = [];

  constructor(private NewsService: NewsService) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.coffeebreak.currentValue) {
      this.getNews(changes.coffeebreak.currentValue);
    }
  }

  getNews(coffeebreak): void {
    this.NewsService.getNews(coffeebreak.tags).subscribe(result => {
      this.news = result.articles;
    });
  }
}
