import { TestBed } from '@angular/core/testing';

import { PasivosService } from './pasivos.service';

describe('PasivosService', () => {
  let service: PasivosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasivosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
