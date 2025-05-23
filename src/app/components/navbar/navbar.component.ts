import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
interface Link {
  path: string;
  title: string;
}

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  links: Link[] = [
    { path: '', title: 'home' },
    { path: '/shop', title: 'shop' },
  ];
}
