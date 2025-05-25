import { Component, Input, SimpleChanges } from '@angular/core';
import * as three from 'three';
import { gsap } from 'gsap';
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

  ngOnChanges(changes: SimpleChanges) {
    if (changes['currentPage']) {
      const step = changes['currentPage'].currentValue;
      console.log(step);
      if (this.model) {
        if (step == 1) {
          gsap.to(this.model.rotation, {
            y: -Math.PI / 2,
            duration: 0.8,
            ease: 'power2.out',
          });
        }
      }
    }
  }
}
