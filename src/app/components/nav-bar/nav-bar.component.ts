import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbCollapseModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-nav-bar",
  standalone: true,
  imports: [CommonModule, NgbCollapseModule],
  templateUrl: "./nav-bar.component.html",
  styleUrl: "./nav-bar.component.scss",
})
export class NavBarComponent {
  public isMenuCollapsed: boolean = true;
}
