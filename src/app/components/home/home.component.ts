import {
  Component,
  ElementRef,
  HostListener,
  inject,
  NgZone,
} from '@angular/core';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import * as three from 'three';
import { CurrentPageComponent } from '../current-page/current-page.component';

@Component({
  selector: 'app-home',
  imports: [CurrentPageComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  maxPages: number = 3;
  currentPage: number = 1;
  elementRef = inject(ElementRef);
  scene: three.Scene = new three.Scene();
  light = new three.AmbientLight('#ffffff', 2);
  getCanvas = () => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '50%';
    canvas.style.left = '50%';
    canvas.style.translate = '-50% -50%';
    return canvas;
  };
  model: three.Object3D | null = null;
  renderer = new three.WebGLRenderer({
    alpha: true,
    canvas: this.getCanvas(),
    antialias: true,
  });
  loader = new GLTFLoader();
  camera = new three.PerspectiveCamera(50, 1, 0.1, 1000);

  bgHeading: HTMLElement | null = null;
  scrollDelta: number = 0;
  isScrolling: boolean = false;
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
  animate = () => {
    requestAnimationFrame(this.animate);
    this.renderer.render(this.scene, this.camera);
  };

  ngDoCheck() {
    if (!this.isScrolling) {
      if (
        this.currentPage > 1 &&
        this.currentPage <= this.maxPages &&
        this.scrollDelta < 0
      ) {
        this.currentPage--;
      }

      if (
        this.currentPage > 0 &&
        this.currentPage < this.maxPages &&
        this.scrollDelta > 0
      ) {
        this.currentPage++;
      }
    }
  }

  ngAfterViewInit() {
    this.bgHeading = this.elementRef.nativeElement.querySelector('.bg-heading');
    this.bgHeading?.scrollTo(0, 0);
    const home = this.elementRef.nativeElement.querySelector('section.home');

    this.camera.position.z = 1;

    this.renderer.setSize(500, 500);
    this.scene.add(this.light);
    home.appendChild(this.renderer.domElement);
    this.loader.load(
      '/source/nike_sko_apply_all.gltf',

      (gltf) => {
        this.model = gltf.scene;

        const box = new three.Box3().setFromObject(this.model);
        const center = box.getCenter(new three.Vector3());

        this.model.position.sub(center);
        this.scene.add(this.model);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }

  constructor(ngZone: NgZone) {
    ngZone.runOutsideAngular(() => {
      this.animate();
    });
  }
}
