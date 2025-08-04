import { Component, effect, inject } from '@angular/core';
import gsap from 'gsap';
import AppService from '../../services/app.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  appService = inject(AppService);
  apiService = inject(ApiService);

  constructor() {
    this.apiService.delayLoadingFinish(this.appService.appLoading);
    effect(() => {
      const appLoading = this.appService.appLoading();
      if (appLoading) {
        gsap.fromTo(
          '.counter',
          {
            innerText: 0 + '%',
          },
          {
            innerText: 100 + '%',
            duration: 2,
            snap: {
              innerText: 1,
            },
          }
        );
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
        this.apiService.delayLoadingFinish(this.appService.appLoading);
      }
    });
  }
}
