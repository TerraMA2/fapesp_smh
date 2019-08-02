import { TestBed } from '@angular/core/testing';

import { MunicipioService } from './municipio.service';

describe('MunicipioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MunicipioService = TestBed.get(MunicipioService);
    expect(service).toBeTruthy();
  });
});
