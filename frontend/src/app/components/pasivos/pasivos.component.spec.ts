import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PasivosComponent } from './pasivos.component';

describe('PasivosComponent', () => {
  let component: PasivosComponent;
  let fixture: ComponentFixture<PasivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PasivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PasivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
