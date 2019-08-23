import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliseDiariaComponent } from './analise-diaria.component';

describe('AnaliseDiariaComponent', () => {
  let component: AnaliseDiariaComponent;
  let fixture: ComponentFixture<AnaliseDiariaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnaliseDiariaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnaliseDiariaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
