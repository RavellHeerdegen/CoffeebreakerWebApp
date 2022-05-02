import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NewsComponent} from "@app/components/news/news.component";


@NgModule({
  exports: [ NewsComponent ],
  declarations: [ NewsComponent ],
  imports: [
    CommonModule
  ]
})
export class NewsModule { }
