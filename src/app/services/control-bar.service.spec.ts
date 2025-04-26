import { TestBed } from '@angular/core/testing';

import { ControlBarService } from './control-bar.service';

describe('ControlBarService', () => {
  let service: ControlBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ControlBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
