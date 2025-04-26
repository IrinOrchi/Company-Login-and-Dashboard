import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: "app-feature-carousel",
  standalone: true,
  imports: [CommonModule, NgbCarouselModule],
  templateUrl: "./feature-carousel.component.html",
  styleUrl: "./feature-carousel.component.scss",
})
export class FeatureCarouselComponent {}
