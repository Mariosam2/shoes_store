import { afterRender, Component, inject } from '@angular/core';
import { ActivationEnd, RouterEvent, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoaderComponent } from './components/loader/loader.component';
import AppService from './app.loader';
import { Router, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  router: Router = new Router();
  title = 'shoes_store';
  appService = inject(AppService);
  constructor() {
    this.router.navigateByUrl('/home');

    this.router.events.subscribe((event) => {
      if (event instanceof ActivationEnd) {
        const url = event.snapshot.url[0];
        if (url.path === 'home') {
          this.appService.setIsLoading(true);
        }
      }
    });
  }
}
