import { TestBed } from '@angular/core/testing';

import { AnaliseDadosResService } from './analise-dados-res.service';

describe('AnaliseDadosResService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnaliseDadosResService = TestBed.get(AnaliseDadosResService);
    expect(service).toBeTruthy();
  });
});
