import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Material Components
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatListModule } from "@angular/material/list";
import { MatCardModule } from "@angular/material/card";
import { MatNativeDateModule, MatInputModule } from "@angular/material";
import { MatChipsModule } from "@angular/material/chips";
import { MatTabsModule } from "@angular/material/tabs";
import { MatDialogModule } from "@angular/material/dialog";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";

import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

import { CoffeebreakService } from "@app/services/coffeebreak.service";

// Our Modules
import { NewsModule } from "@app/components/news/news.module";
import { SidebarModule } from "@app/components/sidebar/sidebar.module";
import { UserModule } from "@app/components/user/user.module";

// Own Components
import {
  CoffeebreakDetailsComponent,
  ForeignProfileComponent
} from "@app/components/coffeebreak/coffeebreak-details/coffeebreak-details.component";
import { SearchCoffeebreakComponent } from "@app/components/coffeebreak/search-coffeebreak/search-coffeebreak.component";
import { CreateCoffeebreakComponent } from "@app/components/coffeebreak/create-coffeebreak/create-coffeebreak.component";
import { CoffeebreaksViewComponent } from "@app/components/coffeebreak/coffeebreaks-view/coffeebreaks-view.component";
import { MessageboardComponent } from "@app/components/coffeebreak/messageboard/messageboard.component";

import { MAT_DATE_LOCALE } from "@angular/material/core";

@NgModule({
  declarations: [
    CreateCoffeebreakComponent,
    CoffeebreakDetailsComponent,
    SearchCoffeebreakComponent,
    CoffeebreaksViewComponent,
    MessageboardComponent,
    ForeignProfileComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    RouterModule,
    FormsModule,
    MatChipsModule,
    SidebarModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatListModule,
    MatCardModule,
    MatTabsModule,
    MatDialogModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    NewsModule,
    UserModule,
    MatProgressSpinnerModule
  ],
  providers: [
    CoffeebreakService,
    MatDatepickerModule,
    { provide: MAT_DATE_LOCALE, useValue: "de-DE" }
  ]
})
export class CoffeebreakModule {}
