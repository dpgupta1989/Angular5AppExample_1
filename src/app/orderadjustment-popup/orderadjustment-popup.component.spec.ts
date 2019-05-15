import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderadjustmentPopupComponent } from './orderadjustment-popup.component';

describe('OrderadjustmentPopupComponent', () => {
  let component: OrderadjustmentPopupComponent;
  let fixture: ComponentFixture<OrderadjustmentPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderadjustmentPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderadjustmentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
