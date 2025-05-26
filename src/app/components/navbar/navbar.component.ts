import {
  afterNextRender,
  Component,
  inject,
  Input,
  SimpleChanges,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import gsap from 'gsap';

interface Link {
  path: string;
  title: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Input() isLoading: boolean = true;
  links: Link[] = [
    { path: '/home', title: 'home' },
    { path: '/shop', title: 'shop' },
  ];

  constructor() {
    afterNextRender(() => {
      gsap.fromTo('.logo', { opacity: 0 }, { duration: 0.5, opacity: 1 });
      gsap.fromTo('.right-nav', { opacity: 0 }, { duration: 0.5, opacity: 1 });
    });
  }
}
