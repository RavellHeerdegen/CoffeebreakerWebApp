import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule, Routes } from "@angular/router";
import { FormsModule } from "@angular/forms";

import { UserModule } from "@app/components/user/user.module";
import { CoffeebreakModule } from "@app/components/coffeebreak/coffeebreak.module";
import { SidebarModule } from "@app/components/sidebar/sidebar.module";
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NewsModule } from "@app/components/news/news.module";

import { AuthService } from "@app/services/auth.service";
import { CoffeebreakService } from "@app/services/coffeebreak.service";
import { SettingsService } from "@app/services/settings.service";
import { MessageboardService } from "@app/services/messageboard.service";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { NewsService } from "@app/services/news.service";
import { MatSelectModule } from "@angular/material/select";

import { AppComponent } from "@app/app.component";
import { LoginComponent } from "@app/components/user/login/login.component";
import { RegisterComponent } from "@app/components/user/register/register.component";
import { ProfileComponent } from "@app/components/user/profile/profile.component";
import { EditProfileComponent } from "@app/components/user/edit-profile/edit-profile.component";
import { CreateCoffeebreakComponent } from "@app/components/coffeebreak/create-coffeebreak/create-coffeebreak.component";
import {
  CoffeebreakDetailsComponent,
  ForeignProfileComponent
} from "@app/components/coffeebreak/coffeebreak-details/coffeebreak-details.component";
import { CoffeebreaksViewComponent } from "@app/components/coffeebreak/coffeebreaks-view/coffeebreaks-view.component";
import { NewsComponent } from "@app/components/news/news.component";
import { CanActivateViaAuthGuard } from "./services/authGuard";

const appRoutes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: "editprofile",
    component: EditProfileComponent,
    canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: "coffeebreak/create",
    component: CreateCoffeebreakComponent,
    canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: "coffeebreak/:id",
    component: CoffeebreakDetailsComponent,
    canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: "coffeebreak/user/profile",
    component: ForeignProfileComponent,
    canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: "coffeebreaks/:own",
    component: CoffeebreaksViewComponent,
    canActivate: [CanActivateViaAuthGuard]
  },
  {
    path: "coffeebreaks",
    component: CoffeebreaksViewComponent,
    canActivate: [CanActivateViaAuthGuard]
  },
  // { path: "coffeebreak/search", component: SearchCoffeebreakComponent },
  {
    path: "news",
    component: NewsComponent,
    canActivate: [CanActivateViaAuthGuard]
  }
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    //Our own modules
    SidebarModule,
    UserModule,
    CoffeebreakModule,
    NewsModule,
    //Angular library modules
    BrowserModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule,
    MatSnackBarModule,
    MatSelectModule
  ],
  providers: [
    AuthService,
    SettingsService,
    CoffeebreakService,
    MessageboardService,
    NewsService,
    CanActivateViaAuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
