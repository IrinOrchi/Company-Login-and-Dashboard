import { Component, HostListener } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-bottom-footer",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./bottom-footer.component.html",
  styleUrl: "./bottom-footer.component.scss",
})
export class BottomFooterComponent {
  dropdownOpen: boolean = false;
  dropdownOpenInternational: boolean = false;

  toggleDropdown(): void {
    this.dropdownOpenInternational = false;
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleDropdown2(): void {
    this.dropdownOpen = false;
    this.dropdownOpenInternational = !this.dropdownOpenInternational;
  }

  @HostListener('document:click', ['$event.target'])
  closeDropdown(targetElement: HTMLElement): void {
    const clickedInside = targetElement.closest('.relative');
    if (!clickedInside) {
      this.dropdownOpen = false;
      this.dropdownOpenInternational = false;
    }
  }
}
