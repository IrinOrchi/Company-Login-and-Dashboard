import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ControlBarComponent } from '../control-bar/control-bar.component';
@Component({
  selector: 'app-credit-redeem',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './credit-redeem.component.html',
  styleUrl: './credit-redeem.component.scss',
})
export class EmptyCreditComponent {
  creditSystemCheckReferral: any | undefined;
  token: string = '';
  loading: boolean = false;
  statusText: string | undefined;
  constructor(private controlBarComponent: ControlBarComponent) {}

  submitCreditSystem() {
    this.loading = true;

    this.controlBarComponent.submitCreditReferral(this.token).subscribe(
      (response: any) => {
        this.loading = false;
        // console.log(response,'creditResponse');
        if(response && response.Message === 'Expired' && response.Reason){
          this.statusText = response.Reason;
        }else if (response && response.Message !== 'success') {
          this.statusText =
            'Invalid referral code. Please enter a valid referral code.';
        }
      },
      () => {
        this.loading = false;
        this.statusText =
          'Invalid referral code. Please enter a valid referral code.';
      }
    );
  }
}
