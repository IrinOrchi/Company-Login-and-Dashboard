import { Component } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';

@Component({
  selector: 'app-company-select-popup',
  standalone: true,
  imports: [],
  templateUrl: './company-select-popup.component.html',
  styleUrl: './company-select-popup.component.scss',
})
export class CompanySelectPopupComponent {
  constructor(private dashboardService: DashboardService) {}
  isClosed: boolean = true;
  selectedCompanySize: string = '';
  companySize = ['1-25', '26-50', '51-100', '101-500', '501-1000', '1000-0'];
  submitButtonDisable: boolean = true;
  onCompanySizeChange(event: any) {
    this.selectedCompanySize = event.target.value;
    this.submitButtonDisable = false;
  }
  closeBottomPopup() {
    this.isClosed = !this.isClosed;
    console.log(this.isClosed);
  }
  submitCompanySize() {
    const values = this.selectedCompanySize.split('-');
    const minValue = parseInt(values[0]);
    const maxValue = parseInt(values[1]);
    this.dashboardService.updateCompanySize(minValue, maxValue).subscribe({
      next: (response) => {
        if (response && response.statuscode === 200) {
          window.localStorage.setItem('companySizePopUp', 'submitted');
          this.closeBottomPopup();
        }
      },
    });
  }
}
