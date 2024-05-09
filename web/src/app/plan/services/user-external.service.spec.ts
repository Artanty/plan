import { TestBed } from '@angular/core/testing';

import { UserExternalService } from './user-external.service';

describe('UserExternalService', () => {
  let service: UserExternalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserExternalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
