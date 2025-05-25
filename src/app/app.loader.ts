import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
class AppLoaderService {
  isLoading: boolean = true;

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }
  getIsLoading() {
    return this.isLoading;
  }
}

export default AppLoaderService;
