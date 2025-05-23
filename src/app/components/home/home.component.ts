import {
  afterRender,
  Component,
  ElementRef,
  HostListener,
  inject,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  elementRef = inject(ElementRef);
  bgHeading: HTMLElement | null = null;
  scrollDelta: number = 0;
  isScrolling: boolean = false;
  maxPages: number = 3;
  page: number = 1;
  @HostListener('document:wheel', ['$event'])
  onScroll(e: WheelEvent) {
    if (!this.isScrolling) {
      this.isScrolling = true;
      this.scrollDelta = e.deltaY;
      this.bgHeading?.scrollBy({
        top: 0,
        left:
          e.deltaY < 0
            ? -this.bgHeading.scrollWidth / 2
            : this.bgHeading.scrollWidth / 2,
        behavior: 'smooth',
      });
      setTimeout(() => {
        this.isScrolling = false;
      }, 500);
    }
  }

  ngDoCheck() {
    if (!this.isScrolling) {
      if (this.page > 1 && this.page <= this.maxPages && this.scrollDelta < 0) {
        this.page--;
      }

      if (this.page > 0 && this.page < this.maxPages && this.scrollDelta > 0) {
        this.page++;
      }
    }
  }

  constructor() {
    afterRender(() => {
      this.bgHeading =
        this.elementRef.nativeElement.querySelector('.bg-heading');
    });
  }
}
