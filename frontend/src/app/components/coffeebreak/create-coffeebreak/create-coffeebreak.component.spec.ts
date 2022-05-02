import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { CreateCoffeebreakComponent } from "@app/components/coffeebreak/create-coffeebreak/create-coffeebreak.component";

describe("CreateCoffeebreakComponent", () => {
  let component: CreateCoffeebreakComponent;
  let fixture: ComponentFixture<CreateCoffeebreakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreateCoffeebreakComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCoffeebreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
