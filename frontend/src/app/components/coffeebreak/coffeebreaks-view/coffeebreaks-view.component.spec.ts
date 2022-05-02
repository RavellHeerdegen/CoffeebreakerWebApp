import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffeebreaksViewComponent } from './coffeebreaks-view.component';

describe('CoffeebreaksViewComponent', () => {
  let component: CoffeebreaksViewComponent;
  let fixture: ComponentFixture<CoffeebreaksViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoffeebreaksViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoffeebreaksViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
