import { Component, OnInit } from '@angular/core';
import { CommonModule } from "@angular/common";
import { NgbCarouselModule } from "@ng-bootstrap/ng-bootstrap";

interface Slide {
  title: string;
  text: string;
  img: string;
  alt: string;
}

@Component({
  selector: "app-feature-carousel",
  standalone: true,
  imports: [CommonModule, NgbCarouselModule],
  templateUrl: "./feature-carousel.component.html",
  styleUrl: "./feature-carousel.component.scss",
})
export class FeatureCarouselComponent implements OnInit {
  public slides: Slide[] = [
    {
      title: 'Online Test',
      text: 'Take online tests anytime, anyplace to evaluate more applicants. Online tests are your beacon to find perfect individuals . Online tests that reveal applicant strengths might enhance your recruitment process.',
      img: 'assets/images/online-test.png',
      alt: 'Online test',
    },
    {
      title: 'Messaging',
      text: "Communication is the heartbeat of any successful endeavor. In the world of hiring, it's the bridge that connects you with your future stars. Share your aspirations, inspire candidates, and foster connections that transcend the boundaries of traditional hiring.",
      img: 'assets/images/messaging.png',
      alt: 'Messaging',
    },
    {
      title: 'Video Interview',
      text: "Don't just read resumes; watch aspirations come to life. A video interview is your window to the soul of a candidate. Witness their passion, their dedication, and their unwavering commitment to your company's success. It's not just an interview; it's a glimpse into the future.",
      img: 'assets/images/video-interview.png',
      alt: 'Video Interview',
    },
    {
      title: 'Filtering',
      text: "Let the refining and improving of your filters for your thoughts be a passionate pursuit. Just as precious metals are sieved from the earth, filter out the finest candidates from the talent pool. Choose those who shine the brightest and bring your company's mission to life.",
      img: 'assets/images/filtering.png',
      alt: 'Filtering',
    },
  ];

  public currentIndex = 0;
  private interval: any;

  constructor() { }

  ngOnInit(): void {
  }

  showSlide(index: number): void {
    this.currentIndex = index;
  }

  nextSlide(): void {
    this.currentIndex = (this.currentIndex + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentIndex = (this.currentIndex - 1 + this.slides.length) % this.slides.length;
  }

  onCarouselClick(event: MouseEvent): void {
    const carousel = (event.currentTarget as HTMLElement);
    const rect = carousel.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    if (clickX < rect.width / 2) {
      this.prevSlide();
    } else {
      this.nextSlide();
    }
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
