import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
class AppService {
  appLoading = signal<boolean>(false);
  step = signal<number>(1);
}

export default AppService;
