import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbRatingModule } from '@ng-bootstrap/ng-bootstrap';
import { SharedDataService } from '../../../../services/cv-details/shared-data.service';
import { ActionDataResponseModel } from '../../../../models/Cv-Details/response/cvActionData';
import { CvDetails } from '../../../../models/Cv-Details/response/cv-details';
import { DataServiceService } from '../../../../services/cv-details/data-service.service';
import { ActivatedRoute, Params } from '@angular/router';
import { IframeComponentComponent } from '../iframe-component/iframe-component.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-cv-actions',
  standalone: true,
  imports: [CommonModule, NgbRatingModule, FormsModule],
  templateUrl: './cv-actions.component.html',
  styleUrl: './cv-actions.component.scss',
})

export class CvActionsComponent implements OnInit {

  constructor(
    public sharedDataService: SharedDataService,
    public dataService: DataServiceService,
    private route: ActivatedRoute,
    private modalService: NgbModal) 
    { }

  cvDetails?: CvDetails;
  cvActionData!: ActionDataResponseModel | null
  Idn: string = '';
  companyId: string = window.localStorage.getItem('CompanyId') ?? '';
  queryString: string = '';
  hasCvAccess: boolean = true;

  rating = 0;
  addComment = false;
  commentView = true;
  inputRating = 0;
  displayRating = 0;
  isDisplayRating = false;
  isContentView = true;

  currnetUserGivenRating = 0;
  currentUserGivenComment = '';
  commentValidationText = '';


  

  ngOnInit(): void {
    this.sharedDataService.cvActionData$.subscribe((data) => {
      this.cvActionData = data;
      this.isCurrentUserHaveComment();
      this.isCurrentUserHaveRating();
    });

    this.sharedDataService.cvDetails$.subscribe((cvDetails) => {
      this.cvDetails = cvDetails;
    });

    this.sharedDataService.isPnpl$.subscribe((data) => {
      this.hasCvAccess = data;
    });

    this.route.queryParams.subscribe((params: Params) => {
      this.Idn = params['Idn'];
    });

    this.queryString = new URLSearchParams(this.route.snapshot.queryParams).toString();


  }

  isCurrentUserHaveComment(): void {
    if (this.cvActionData?.commentDetails.length === 0) {
      this.currentUserGivenComment = '';
    }
    const userComment = this.cvActionData?.commentDetails.find((comment) => comment.viewedId === this.cvActionData?.applicantData.userViewId);
    this.currentUserGivenComment = userComment ? userComment.commentText : '';
  }

  isCurrentUserHaveRating(): void {
    if (this.cvActionData?.commentDetails.length === 0) {
      this.currnetUserGivenRating = 0;
    }
    const userComment = this.cvActionData?.commentDetails.find((comment) => comment.viewedId === this.cvActionData?.applicantData.userViewId);
    this.currnetUserGivenRating = userComment ? userComment.commentRating : 0;
  }

  downloadCustomCv(): void {
    this.dataService.downloadCustomcV(this.cvDetails?.Name.FullName ?? '', this.Idn , this.cvActionData?.applicantData.haveAttachment ?? '')
  }

  redirectToLink(): void {
    const fullParam = 'https://corporate3.bdjobs.com/VideoResume_Watch.asp?cvbank=1&' + this.queryString;
    window.open(fullParam, '_blank');
  }


  openShortlistView() {
    const modalRef = this.modalService.open(IframeComponentComponent, {
      windowClass: 'custom-modal-size',
    });
    modalRef.componentInstance.urlToPreview =
      'https://corporate3.bdjobs.com/cv_short_list.asp?appids=' +
      this.Idn +
      '&name=' + this.cvDetails?.Name.FullName;
  }

  addUpdateComment(): void {

    if (this.currentUserGivenComment.length > 500) {
      this.commentValidationText = 'Comment can be maximum 500 characters long.';
      return;
    }
    else{
      this.commentValidationText = '';
    }

   this.dataService.addOrUpdateComment(this.currentUserGivenComment,this.currnetUserGivenRating , this.cvActionData?.applicantData.userViewId ?? 0).subscribe({
      next: (data) => {
        console.log(data);
        this.addComment = false;
        this.commentView = true;
        if (this.cvActionData?.commentDetails.length == 0) {
            this.cvActionData?.commentDetails.push({
            commentText: this.currentUserGivenComment,
            commentRating: this.currnetUserGivenRating,
            viewedId: this.cvActionData?.applicantData.userViewId
            });
        }
      },
      error: (error) => {
        console.log(error);
        this.addComment = false;
        this.commentView = true;
      }
   });
  }


  


  applyRating(): void {
    this.displayRating = this.inputRating;
     this.isDisplayRating = true;
    this.isContentView = false;
    this.addComment = false;
    this.commentView = true;
  }

  Showcomment() {
    this.addComment = true;
    this.commentView = false;
  }

  editComment(): void {
    this.addComment = true;
    this.commentView = false


  }

  Cancelcomment() {
    this.addComment = false;
    this.commentView = true;
  }


}
