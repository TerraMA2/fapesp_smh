import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnaliseMensalComponent } from './analise-mensal.component';

describe('AnaliseMensalComponent', () => {
  let component: AnaliseMensalComponent;
  let fixture: ComponentFixture<AnaliseMensalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnaliseMensalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnaliseMensalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
