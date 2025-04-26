import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultipleJobPostPopupComponent } from './multiple-job-post-popup.component';

describe('MultipleJobPostPopupComponent', () => {
  let component: MultipleJobPostPopupComponent;
  let fixture: ComponentFixture<MultipleJobPostPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultipleJobPostPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MultipleJobPostPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
