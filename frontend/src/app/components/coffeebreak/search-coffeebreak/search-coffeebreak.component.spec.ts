import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SearchCoffeebreakComponent } from "@app/components/coffeebreak/search-coffeebreak/search-coffeebreak.component";

describe("SearchCoffeebreakComponent", () => {
  let component: SearchCoffeebreakComponent;
  let fixture: ComponentFixture<SearchCoffeebreakComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchCoffeebreakComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCoffeebreakComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
