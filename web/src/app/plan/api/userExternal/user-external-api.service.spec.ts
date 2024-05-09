import { TestBed } from '@angular/core/testing';

import { UserExternalApiService } from './user-external-api.service';

describe('UserExternalApiService', () => {
  let service: UserExternalApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserExternalApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
