import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-banner-modal',
  templateUrl: './banner-modal.component.html',
  styleUrls: ['./banner-modal.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class BannerModalComponent implements OnInit {

  constructor(public activeModal: NgbActiveModal) {}
  dismiss() {
    this.activeModal.dismiss('Cross click');
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    window.localStorage.setItem('bannerShow', '1');
  }

}
