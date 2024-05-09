import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { userExternalsResolver } from './user-externals.resolver';

describe('userExternalsResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) => 
      TestBed.runInInjectionContext(() => userExternalsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
