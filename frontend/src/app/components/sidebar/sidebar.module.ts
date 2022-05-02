import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { MatSidenavModule, MatIconModule } from "@angular/material";
import { MatButtonModule } from "@angular/material/button";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { SidebarComponent } from "@app/components/sidebar/sidebar.component";

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    FontAwesomeModule
  ],
  exports: [SidebarComponent],
  declarations: [SidebarComponent],
  providers: []
})
export class SidebarModule {}
