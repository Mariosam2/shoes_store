import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterPaymentComponent } from './after-payment.component';

describe('AfterPaymentComponent', () => {
  let component: AfterPaymentComponent;
  let fixture: ComponentFixture<AfterPaymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AfterPaymentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AfterPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
