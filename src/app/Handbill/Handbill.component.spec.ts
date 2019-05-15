import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandbillComponent } from './Handbill.component';

describe('HandbillComponent', () => {
  let component: HandbillComponent;
  let fixture: ComponentFixture<HandbillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandbillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandbillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
