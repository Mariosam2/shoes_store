import { Component, inject, Input, SimpleChanges } from '@angular/core';
import * as three from 'three';
import { gsap } from 'gsap';
import AppService from '../../app.service';
@Component({
  selector: 'app-current-page',
  imports: [],
  templateUrl: './current-page.component.html',
  styleUrl: './current-page.component.css',
})
export class CurrentPageComponent {
  @Input() model: three.Object3D | null = null;
  @Input() maxPages: number = 3;
  @Input() currentPage: number = 1;
  appService = inject(AppService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentPage']) {
      const step = changes['currentPage'].currentValue;
      this.appService.setStep(step);
      if (this.model) {
        if (step == 1) {
          gsap.to(this.model.rotation, {
            y: Math.PI / 2,
            x: 0,
            z: 0,
            duration: 0.8,
            ease: 'power2.out',
          });
        }
        if (step == 2) {
          gsap.to(this.model.rotation, {
            y: Math.PI / 1,
            x: Math.PI / 2,
            z: 0,
            duration: 0.8,
            ease: 'power2.out',
          });
        }

        if (step == 3) {
          gsap.to(this.model.rotation, {
            y: Math.PI / 2,
            x: 0,
            z: -Math.PI / 2,
            duration: 0.8,
            ease: 'power2.out',
          });
        }
      }
    }
  }
}
