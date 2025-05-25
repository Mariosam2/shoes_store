import { afterNextRender, Component, inject } from '@angular/core';
import gsap from 'gsap';
import AppLoaderService from '../../app.loader';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  counter: number = 0;
  appLoaderService = inject(AppLoaderService);

  constructor() {
    setTimeout(() => {
      this.appLoaderService.setIsLoading(false);
    }, 2000);
    afterNextRender(() => {
      gsap.to('.counter', {
        innerText: 100 + '%',
        duration: 2,
        snap: {
          innerText: 1,
        },
      });
      gsap.fromTo(
        '.progress-bar',
        {
          scaleX: 0,
          transformOrigin: 'left',
        },
        {
          duration: 2,
          scaleX: 1,
        }
      );
    });
  }
}
