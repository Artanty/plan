import { ActivatedRouteSnapshot, Resolve, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { UserExternalStoreService } from '../store/userExternal/user-external-store.service';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, filter, firstValueFrom, map, of, switchMap } from 'rxjs';
import { UserExternalService } from '../services/user-external.service';

@Injectable()
export class UserExternalsResolver implements Resolve<boolean> {
  constructor(
    private userExternalService: UserExternalService,
    private userExternalStoreService: UserExternalStoreService
  ) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userExternalService.getUserExternals().pipe(
      switchMap(() => this.userExternalStoreService.listenUserExternals()),
      filter(Boolean),
      map(() => true),
      catchError((err) => {
        console.error(err);
        return of(false);
      })
    );
  }
}
