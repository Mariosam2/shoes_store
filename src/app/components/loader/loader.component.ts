import {
  afterRender,
  Component,
  inject,
  Input,
  SimpleChanges,
} from '@angular/core';
import gsap from 'gsap';
import AppService from '../../app.service';

@Component({
  selector: 'app-loader',
  imports: [],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css',
})
export class LoaderComponent {
  appService = inject(AppService);
  @Input() isLoading: boolean;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isLoading'] && changes['isLoading'].currentValue) {
      //console.log(changes['isLoading'].currentValue);
      this.isLoading = changes['isLoading'].currentValue;
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
      setTimeout(() => {
        this.appService.setIsLoading(false);
      }, 2000);
    }
  }

  constructor() {
    this.isLoading = this.appService.getIsLoading();
    afterRender(() => {});
  }
}
