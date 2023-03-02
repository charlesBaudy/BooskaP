import { TestBed } from '@angular/core/testing';

import { CablesService } from './cables.service';

describe('CablesService', () => {
  let service: CablesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CablesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
