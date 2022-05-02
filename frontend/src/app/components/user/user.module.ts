import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginComponent } from "@app/components/user/login/login.component";
import { ProfileComponent } from "@app/components/user/profile/profile.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SidebarModule } from "@app/components/sidebar/sidebar.module";
import { EditProfileComponent } from "./edit-profile/edit-profile.component";
import { RegisterComponent } from "./register/register.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material";
import { MatButtonModule } from "@angular/material/button";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { MatSelectModule } from "@angular/material/select";

@NgModule({
  declarations: [
    LoginComponent,
    ProfileComponent,
    EditProfileComponent,
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FontAwesomeModule,
    MatSelectModule
  ],
  exports: [ProfileComponent]
})
export class UserModule {}
