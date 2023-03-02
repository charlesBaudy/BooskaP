import { TestBed } from '@angular/core/testing';

import { IldsService } from './ilds.service';

describe('IldsService', () => {
  let service: IldsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IldsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
