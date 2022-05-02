import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CoffeebreakDetailsComponent } from "@app/components/coffeebreak/coffeebreak-details/coffeebreak-details.component";

describe("CoffeebreakViewComponent", () => {
  let component: CoffeebreakDetailsComponent;
  let fixture: ComponentFixture<CoffeebreakDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CoffeebreakDetailsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoffeebreakDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
