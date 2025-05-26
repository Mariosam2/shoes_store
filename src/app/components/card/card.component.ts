import { Component, Input, SimpleChanges } from '@angular/core';
import gsap from 'gsap';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';

gsap.registerPlugin(DrawSVGPlugin);

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
})
export class CardComponent {
  @Input() step: number = 1;
  tl = gsap.timeline();
  cardData = [
    {
      title: 'Personal branding',
      content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam officia
      quaerat pariatur velit, illum, inventore hic facere qui nulla aperiam,
      quam sit facilis aspernatur? Optio dolores maiores dignissimos dicta
      incidunt?`,
    },
    {
      title: 'Step into Comfort and Style',
      content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam officia
      quaerat pariatur velit, illum, inventore hic facere qui nulla aperiam,
      quam sit facilis aspernatur? Optio dolores maiores dignissimos dicta
      incidunt?`,
    },
    {
      title: 'Engineered for Every Step',
      content: `Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam officia
      quaerat pariatur velit, illum, inventore hic facere qui nulla aperiam,
      quam sit facilis aspernatur? Optio dolores maiores dignissimos dicta
      incidunt?`,
    },
  ];

  ngOnChanges(changes: SimpleChanges) {
    if (changes['step']) {
      const step = changes['step'].currentValue;
      if (step == 1) {
        gsap.to('.top-square', { duration: 0.25, bottom: '30%' });
        gsap.to('.bottom-square', { duration: 0.25, bottom: '25%' });
      }
      if (step == 2) {
        gsap.to('.top-square', { duration: 0.25, bottom: '25%' });
        gsap.to('.bottom-square', { duration: 0.25, bottom: '25%' });
      }
      if (step == 3) {
        gsap.to('.top-square', { duration: 0.25, bottom: '25%' });
        gsap.to('.bottom-square', { duration: 0.25, bottom: '30%' });
      }

      this.tl.clear(true);
      this.tl.add(
        gsap.fromTo(
          '.card',
          {
            opacity: 0,
            y: step === 3 ? 20 : -20,
            boxShadow: '0px 0px 0px 0px #110c2e26',
          },
          {
            duration: 0.5,
            opacity: 1,
            y: 0,
            boxShadow: '0px 32px 60px 0px #110c2e26',
          }
        )
      );
      this.tl.add(
        gsap.fromTo(
          '#path-link',
          {
            drawSVG: 0,
          },
          {
            duration: 0.5,
            drawSVG: '100%',
          }
        )
      );
      this.tl.add(
        gsap.fromTo(
          '#circle-link',
          {
            opacity: 0,
          },
          {
            duration: 0.5,
            opacity: 1,
          }
        )
      );
    }
  }
}
