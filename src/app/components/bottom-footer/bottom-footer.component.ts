import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbDropdownModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-bottom-footer",
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: "./bottom-footer.component.html",
  styleUrl: "./bottom-footer.component.scss",
})
export class BottomFooterComponent {}
