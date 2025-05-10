import { Component, isDevMode, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { LoginService } from "./services/login.service";
import {BottomFooterComponent} from "./components/bottom-footer/bottom-footer.component";
import { GlobalDataSharingService } from "./services/shared/global-data-sharing.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavBarComponent,
    FooterComponent,
    BottomFooterComponent,
    
  ],
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "corporate-homepage-angular";
  hideAppLayout: boolean = true;
  shouldShowHeader?: boolean = true;
  shouldShowFooter?: boolean = true;  

  constructor(
    private loginService: LoginService,
    private globalDataSharingService: GlobalDataSharingService
     ) {}

  ngOnInit(): void {
    this.loginService.isRedirectingToLegacySite.subscribe((data) => {
      this.hideAppLayout = data;
    });    
    this.globalDataSharingService

    this.globalDataSharingService.globalVariables$.subscribe((value) => {
      this.shouldShowFooter = value?.shouldShowFooter;
      this.shouldShowHeader = value?.shouldShowHeader;
    });

    if (isDevMode()) {
      window.localStorage.setItem('CompanyId', 'ZRLwPELx');
      window.localStorage.setItem('UserId', 'ZRYuPid0');
    }
  }
}
