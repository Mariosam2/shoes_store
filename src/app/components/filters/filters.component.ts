import { Component, ElementRef, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { isAxiosError, Vendor } from '../../types';
import axios from 'axios';
import AppService from '../../app.service';
import { Router } from '@angular/router';

interface VendorResponse {
  success: boolean;
  vendors: Vendor[];
}

@Component({
  selector: 'app-filters',
  imports: [MatExpansionModule, FormsModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css',
})
export class FiltersComponent {
  readonly panelOpenState = signal(false);
  elementRef = inject(ElementRef);
  router = new Router();
  appService = inject(AppService);
  vendorFilters: string[] = [];
  priceFilter: number = 0;
  vendors: Vendor[] = [];
  changeVendors = () => {
    const checkedCheckboxes = this.elementRef.nativeElement.querySelectorAll(
      'input[type="checkbox"]:checked'
    );

    for (const checkbox of checkedCheckboxes) {
      this.vendorFilters.push(checkbox.value);
    }
  };
  getVendors = async () => {
    try {
      const response = await axios.get<VendorResponse>(
        this.appService.apiUrl + '/vendors'
      );
      this.vendors = response.data.vendors;
    } catch (err) {
      if (isAxiosError(err)) {
        this.router.navigateByUrl(
          `/error?status="${err.status}"&message="${err.message}"`
        );
      } else {
        this.router.navigateByUrl(`/error?message="${(err as Error).message}"`);
      }
    }
  };

  async ngOnInit() {
    await this.getVendors();
  }
}
