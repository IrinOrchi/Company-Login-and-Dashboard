import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbCarouselModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { FormsModule } from '@angular/forms';
import { LoginPageCountService } from '../../services/login-page-count.service';
import { CookieService } from 'ngx-cookie-service';
import { FeatureCarouselComponent } from '../../components/feature-carousel/feature-carousel.component';
import { GatewayDataSharingService } from '../../services/gateway-data-sharing.service';
import { SupportingInfo } from '../../models/shared/SupportingInfo';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    NgbNavModule,
    RouterModule,
    FormsModule,
    NgbCarouselModule,
    FeatureCarouselComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  active = 1;

  userName: string = '';
  password: string = '';
  rememberUser: boolean = false;
  loginFormErrorMessage: string = '';
  totalJobAdCount: string = 'Loading...';
  totalCvBankCount: string = 'Loading...';
  totalJobApplicationCount: string = 'Loading...';
  legacySiteRedirectURL = 'https://corporate3.bdjobs.com/corporate_default.asp';
  recruiterRedirectURL = 'https://recruiter.bdjobs.com/jobposting/';
  isLoginApiCallPending = false;
  
  urlParams = new URLSearchParams(window.location.search);
  
  queryString: any = this.urlParams.get('selectedJobType')
  ? this.urlParams.get('selectedJobType')
  : '';
  jobNo: string | null = this.urlParams.get('jobNo');
  frmFair: string | null = this.urlParams.get('frmFair');
  constructor(
    // private gatewayDataSharingService: GatewayDataSharingService,
    private loginService: LoginService,
    private loginPageCountService: LoginPageCountService,
    private router: Router,
    private route: ActivatedRoute,
    private cookieService: CookieService
  ) {}

  async ngOnInit() {

    // this.loginService.getUserLoginData().subscribe((data)=>{
    //   if(data){
        
    //     if (this.frmFair === '1' && this.jobNo) {
    //       const fairRedirectURL = `https://corporate3.bdjobs.com/Applicant_Process.asp?jobno=${this.jobNo}&pgtype=al&st=0&frmFair=1&jview=1`;
    //       console.log('Redirecting to:', fairRedirectURL);
    //       window.location.replace(fairRedirectURL);
    //       return; 
    //     }
    //   }
    // })
    // this.loginService.getUserLoginData().subscribe((data) => {
    //   // Check if the user is logged in (i.e., data does not contain `notLoggedIn: true`)
    //   if (data && !data.notLoggedIn) {
    //     Decoded token is found, proceed with redirection logic
    //     if (this.frmFair === '1' && this.jobNo) {
    //       const fairRedirectURL = `https://corporate3.bdjobs.com/Applicant_Process.asp?jobno=${this.jobNo}&pgtype=al&st=0&frmFair=1&jview=1`;
    //       console.log('Redirecting to:', fairRedirectURL);
  
    //       // Use window.location.href instead of window.location.replace
    //       window.location.href = fairRedirectURL;
    //       return;
    //     }
    //   } else {
    //     // Handle the case where the user is not logged in
    //     console.log('User is not logged in. Redirection aborted.');
    //   }
    // });
  

    console.log('frmFair:', this.frmFair);
    console.log('jobNo:', this.jobNo);

    const serviceType: string | null =
      this.route.snapshot.queryParamMap.get('styp');

    const queryParams = this.route.snapshot.queryParamMap;
    // this.queryString = queryParams.keys.length
    //   ? queryParams.keys
    //       .map((key) => `${key}=${queryParams.get(key)}`)
    //       .join('&')
    //   : '';

    if (serviceType) {
      switch (serviceType) {
        case 'pnpl':
          this.legacySiteRedirectURL =
            'https://corporate3.bdjobs.com/job_posting_board.asp?styp=pnpl&from=recruiter';
          break;
        case 'bc':
          this.legacySiteRedirectURL =
            'https://corporate3.bdjobs.com/job_posting_board.asp?styp=bc&from=recruiter';
          break;
        case 'so':
          this.legacySiteRedirectURL =
            'https://corporate3.bdjobs.com/job_posting_board.asp?styp=so&from=recruiter';
          break;
        case 'sp':
          this.legacySiteRedirectURL =
            'https://corporate3.bdjobs.com/job_posting_board.asp?styp=sp&from=recruiter';
          break;
        case 'hj':
          this.legacySiteRedirectURL =
            'https://corporate3.bdjobs.com/job_posting_board.asp?styp=hj&from=recruiter';
          break;
        case 'hjp':
          this.legacySiteRedirectURL =
            'https://corporate3.bdjobs.com/job_posting_board.asp?styp=hjp&from=recruiter';
          break;
        case 'ud':
          this.legacySiteRedirectURL =
            'https://corporate3.bdjobs.com/job_posting_board.asp?styp=ud&from=recruiter';
          break;
        case 'intern':
          this.legacySiteRedirectURL =
            'https://corporate3.bdjobs.com/job_posting_board.asp?styp=intern&from=recruiter';
          break;
        case 'freeBlueCol':
          this.legacySiteRedirectURL =
            'https://corporate3.bdjobs.com/job_posting_board.asp?styp=freeBlueCol&from=recruiter';
          break;
        case 'ln':
          this.legacySiteRedirectURL =
            'https://corporate3.bdjobs.com/job_posting_board.asp?styp=ln&from=recruiter';
          break;
        default:
          this.legacySiteRedirectURL =
            'https://corporate3.bdjobs.com/corporate_default.asp&from=recruiter';
          break;
      }
    }

    const jobPostType: string | null =
      this.route.snapshot.queryParamMap.get('pt');

    const prefix = this.legacySiteRedirectURL.indexOf('?') > 0 ? '&' : '?';

    switch (jobPostType) {
      case 'p':
        this.legacySiteRedirectURL += `${prefix}pt=p`;
        break;
      case 'a':
        this.legacySiteRedirectURL += `${prefix}pt=a`;
        break;
      case 'd':
        this.legacySiteRedirectURL += `${prefix}pt=d`;
        break;
      case 'f':
        this.legacySiteRedirectURL += `${prefix}pt=f`;
        break;
      default:
        break;
    }

    this.loginPageCountService.getJobAdCount().subscribe((data: string) => {
      if (data) {
        this.totalJobAdCount = data;
      }
    });

    setInterval(() => {
      this.loginPageCountService.getJobAdCount().subscribe((data: string) => {
        if (data) {
          this.totalJobAdCount = data;
        }
      });
    }, 12000);

    this.loginPageCountService.getCvBankCount().subscribe((data: string) => {
      if (data) {
        data = data.split('###')[0];

        this.totalCvBankCount = `${(
          parseInt(data.replaceAll(',', '')) / 1000000
        ).toFixed(1)}M+`;
      }
    });

    this.loginPageCountService
      .getApplicationCount()
      .subscribe((data: string) => {
        if (data) {
          this.totalJobApplicationCount = data;
        }
      });

    setInterval(() => {
      this.loginPageCountService
        .getApplicationCount()
        .subscribe((data: string) => {
          if (data) {
            this.totalJobApplicationCount = data;
          }
        });
    }, 12000);
  }



  onClickLoginButton() {
    ////debugger;
    console.log('frmFair:', this.frmFair);
    console.log('jobNo:', this.jobNo);

    // if (this.frmFair === '1' && this.jobNo) {
    //   const fairRedirectURL = `https://corporate3.bdjobs.com/Applicant_Process.asp?jobno=${this.jobNo}&pgtype=al&st=0&frmFair=1&jview=1`;
    //   console.log('Redirecting to:', fairRedirectURL);
    //   window.location.replace(fairRedirectURL);
    //   return; // Exit the function to prevent further execution
    // }

    this.loginFormErrorMessage = '';

    if (this.userName === '' && this.password === '') {
      this.loginFormErrorMessage = 'Enter a valid username and password.';
      return;
    } else if (this.userName === '') {
      this.loginFormErrorMessage = 'Enter a valid username.';
      return;
    } else if (this.password === '') {
      this.loginFormErrorMessage = 'Enter a valid password.';
      return;
    }

    this.isLoginApiCallPending = true;

    this.loginService.loginUser(this.userName, this.password).subscribe({
      next: (data) => {
        //debugger;
        console.log("data")
        if (
          data &&
          data.status === 200 &&
          data.message === 'User logged in successfully.' &&
          data.redirectUrl
        ) {
          // this.loginService.userId = data.userId;
          // this.loginService.companyId = data.companyId;
          // this.loginService.decodeId = data.decodeId;

          // debugger;
          // this.cookieService.set('AUTH_TOKEN', data.token);
          // this.cookieService.set('REF_TOKEN', data.refreshToken);
          console.log("data")
          // this.loginService.setCookies().subscribe({
          //   next: (data) => {
              
          //     if (data) {
          //       console.log(data)
          //       console.log("data")
          //       console.log(this.queryString)

          //       if (this.frmFair === '1' && this.jobNo) {
          //         const fairRedirectURL = `https://corporate3.bdjobs.com/Applicant_Process.asp?jobno=${this.jobNo}&pgtype=al&st=0&frmFair=1&jview=1`;
          //         console.log('Redirecting to:', fairRedirectURL);
          //         window.location.replace(fairRedirectURL);
          //         return; 
          //       }else{
          //         if (this.queryString === '' &&  this.frmFair && this.frmFair === '' && this.jobNo) {
          //           console.log("data1")
          //           this.router.navigate(['dashboard']);
          //         } else {
          //           console.log("data2")
          //           setTimeout(() => {
                      
          //             console.log('this is the query string valu on login -- '+this.queryString)
                     
          //             this.router.navigate(['dashboard'], { queryParams: { selectedJobType: this.queryString} });
          //           }, 2000);
                     
          //         }
          //       }

                
          //     }
          //   },
          // });
          // console.log('in Login service');

          // var userId = '';
          // this.loginService.getCompanyId().subscribe({
          //   next: (data) => {
          //     if (data) {
          //       companyId = data;
          //     }
          //   },
          // });
          //var userId = window.localStorage.getItem('userId') ?? '';
          //var companyId = window.localStorage.getItem('companyId') ?? '';
          // this.loginService.getUserId().subscribe({
          //   next: (data) => {
          //     if (data) {
          //       userId = data;
          //     }
          //   },
          // });
          // console.log('compnayId', compnayId);

          // this.loginService.getUserLoginData();
          // debugger;
          
          //     this.loginService
          //       .setCookies(
          //         "",""
          //       )
          //       .subscribe((data: any) => {
          //         if (data && data.status == 200) {
          //           this.loginService
          //             .getUserLoginData()
          //             .subscribe((userData: any) => {
          //               this.loginService.setLegacyApiDataToLocalStoarge(
          //                 userData
          //               );

          //               if (this.queryString === '') {
          //                 //there is no query string in the url
          //                 this.router.navigate(['dashboard']);
          //               } else {
          //                 this.redirectToServiceTypeUrl(this.queryString);
          //               }
          //             });

          //       });

          // });
        
          this.loginService.setCookies().subscribe({
            next: (data) => {
              if (data) {
                console.log(data);
                console.log("data");
                console.log(this.queryString);
          
                // Check if frmFair and jobNo are present
                if (this.frmFair === '1' && this.jobNo) {
                  const fairRedirectURL = `https://corporate3.bdjobs.com/Applicant_Process.asp?jobno=${this.jobNo}&pgtype=al&st=0&frmFair=1&jview=1`;
                  console.log('Redirecting to:', fairRedirectURL);
                  window.location.replace(fairRedirectURL);
                  return; // Exit the function to prevent further execution
                }
          
                // If frmFair and jobNo are not present, redirect to dashboard
                if (this.queryString === '' && !this.frmFair && !this.jobNo) {
                  console.log("data1");
                  this.router.navigate(['dashboard']);
                } else {
                  console.log("data2");
                  setTimeout(() => {
                    console.log('this is the query string value on login -- ' + this.queryString);
                    this.router.navigate(['dashboard'], { queryParams: { selectedJobType: this.queryString } });
                  }, 2000);
                }
              }
            },
            error: (error) => {
              console.error('Error setting cookies:', error);
            }
          });
        
        } else {
          if (data) {
            this.loginFormErrorMessage = data.message;
            this.isLoginApiCallPending = false;
          } else {
            this.loginFormErrorMessage = 'An unknown error occurred.';
            this.isLoginApiCallPending = false;
          }
        }
      },
      error: () => {
        this.loginFormErrorMessage = "Couldn't connect to the server.";
        this.isLoginApiCallPending = false;
      },
    });
  }

  redirectToServiceTypeUrl(servicetype: string) {
    switch (servicetype) {
      case 'from=servicePage':
        window.location.replace(
          'https://corporate3.bdjobs.com/services.asp?from=recruiter'
        );
        break;
      case 'selectedJobType=bc':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=bc&psta=new`
        );
        break;
      case 'selectedJobType=so':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=so&psta=new`
        );
        break;
      case 'selectedJobType=sp':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=sp&psta=new`
        );
        break;
      case 'selectedJobType=hj':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=hj&psta=new`
        );
        break;
      case 'selectedJobType=hjp':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=hjp&psta=new`
        );
        break;
      case 'selectedJobType=pnpl':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=pnpl&psta=new`
        );
        break;
      case 'selectedJobType=ln':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=ln&psta=new`
        );
        break;
      case 'selectedJobType=fjp':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=fjp&psta=new`
        );
        break;
      case 'selectedJobType=ud':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=ud&psta=new`
        );
        break;
      case 'selectedJobType=intern':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=intern&psta=new`
        );
        break;
      case 'selectedJobType=freeBlueCol':
        window.location.replace(
          `${this.recruiterRedirectURL}job-information?styp=freeBlueCol&psta=new`
        );
        break;
      default:
        this.router.navigate(['dashboard']);
        break;
    }
  }
}
