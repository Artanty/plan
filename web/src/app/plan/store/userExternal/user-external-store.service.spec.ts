import { TestBed } from '@angular/core/testing';

import { UserExternalStoreService } from './user-external-store.service';

describe('UserExternalStoreService', () => {
  let service: UserExternalStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserExternalStoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
