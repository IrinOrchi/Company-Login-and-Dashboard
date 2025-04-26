import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobInformation } from '../../models/JobInformation';
import { GatewayDataSharingService } from '../../services/gateway-data-sharing.service';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-stepper',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
})
export class StepperComponent implements OnInit {
  @Input() jobInformation?: JobInformation;

  hasSalesClearance: boolean = false;
  hasAccountsClearance: boolean = false;
  hasContentClearance: boolean = false;
  isPublished: boolean = false;
  progressBarValue: number = 0;
  nidVerify: boolean | undefined;
  paymentProcess: boolean | undefined;
  verificationStatus: boolean | undefined;
  /**
   *
   */
  freeJob: string[] = [
    'Free Listing',
    'Selected Blue Collar Job',
    'Internship Announcement',
  ];
  isBillingShow: boolean = false;

  constructor(private loginService: LoginService) {}
  ngOnInit(): void {
    const serviceType = this.jobInformation?.serviceType ?? '';
    if (this.freeJob.includes(serviceType)) {
      this.isBillingShow = false;
    } else {
      this.isBillingShow = true;
    }
    this.hasSalesClearance = (this.jobInformation?.salesVerify ?? 0) > 0;
    this.hasAccountsClearance = (this.jobInformation?.accountsVerify ?? 0) > 0;
    this.hasContentClearance = (this.jobInformation?.contentVerify ?? 0) > 0;
    this.isPublished = this.jobInformation?.isPublished ?? false;

    if (this.isBillingShow) {
      if (this.hasSalesClearance) {
        this.progressBarValue = 35;
      }
      if (this.hasAccountsClearance) {
        this.progressBarValue = 65;
      }
      if (this.hasContentClearance) {
        this.progressBarValue = 100;
      }
    } else {
      if (this.hasSalesClearance) {
        this.progressBarValue = 55;
      }
      if (this.hasContentClearance) {
        this.progressBarValue = 100;
      }
    }
    this.loginService.getSupportingInfo().subscribe((supportingInfo) => {
      if (supportingInfo) {
        this.nidVerify = supportingInfo?.NidVerify;
        this.paymentProcess = supportingInfo.PaymentProcess;
        this.verificationStatus = supportingInfo.VerificationStatus;
        // console.log(supportingInfo?.data.Sessions.NIDVERIFY, 'nid');
        if (
          !this.nidVerify &&
          !this.paymentProcess &&
          !this.verificationStatus
        ) {
          if (this.hasSalesClearance) {
            this.progressBarValue = 30;
          }

          if (this.hasAccountsClearance) {
            this.progressBarValue = 55;
          }

          if (this.hasContentClearance) {
            this.progressBarValue = 100;
          }
        }
      }
    });
  }
}
