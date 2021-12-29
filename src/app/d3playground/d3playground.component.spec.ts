import { ComponentFixture, TestBed } from '@angular/core/testing';

import { D3playgroundComponent } from './d3playground.component';

describe('D3playgroundComponent', () => {
  let component: D3playgroundComponent;
  let fixture: ComponentFixture<D3playgroundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ D3playgroundComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(D3playgroundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
