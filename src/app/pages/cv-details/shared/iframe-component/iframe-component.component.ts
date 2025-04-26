import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe-component',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './iframe-component.component.html',
  styleUrl: './iframe-component.component.scss'
})
export class IframeComponentComponent {
  @Input() urlToPreview: string = '';
  safeUrl!: SafeResourceUrl;

  constructor(public activeModal: NgbActiveModal, private sanitizer: DomSanitizer) {}

  ngOnInit() {
    this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.urlToPreview);
  }

  closeModal() {
    this.activeModal.close();
  }
}
