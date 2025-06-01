import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error',
  imports: [],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent {
  activatedRoute = inject(ActivatedRoute);
  status: number | undefined;
  message: string | undefined;
  constructor() {
    if (this.activatedRoute.snapshot.queryParams['status']) {
      this.status = JSON.parse(
        this.activatedRoute.snapshot.queryParams['status']
      );
    }
    this.message = this.activatedRoute.snapshot.queryParams['message'];
  }
}
