import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
class AppService {
  isLoading: boolean = true;
  step: number = 1;

  setStep(value: number) {
    this.step = value;
  }

  getStep() {
    return this.step;
  }

  setIsLoading(value: boolean) {
    this.isLoading = value;
  }
  getIsLoading() {
    return this.isLoading;
  }
}

export default AppService;
