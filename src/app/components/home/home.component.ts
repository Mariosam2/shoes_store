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
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as three from 'three';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  elementRef = inject(ElementRef);
  scene: three.Scene = new three.Scene();

  getCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.translate = '50% 50%';
    return canvas;
  };
  renderer = new three.WebGLRenderer({ alpha: true, canvas: this.getCanvas() });
  loader = new GLTFLoader();
  camera = new three.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
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
      const home = this.elementRef.nativeElement.querySelector('section.home');
      this.loader.load(
        'path/to/model.glb',

        (gltf) => {
          home.appendChild(this.renderer.domElement);
          this.scene.add(gltf.scene);
        },
        undefined,
        function (error) {
          console.error(error);
        }
      );
    });
  }
}
