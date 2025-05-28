import { Injectable, isDevMode } from '@angular/core';
import { environment } from '../environment/environment';
import { prodEnvironment } from '../environment/environtment.prod';

@Injectable({
  providedIn: 'root',
})
class AppService {
  isLoading: boolean = false;
  step: number = 1;
  apiUrl: string = isDevMode() ? environment.apiURL : prodEnvironment.apiURL;

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
