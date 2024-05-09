import { HttpBackend, HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { IGetUserExternalsApi } from '../../../../../contracts/getUserExternals';
import { Observable, delay, finalize, firstValueFrom, lastValueFrom, startWith, take, tap } from 'rxjs';
import { UserExternalApiService } from '../api/userExternal/user-external-api.service';
import { UserExternalStoreService } from '../store/userExternal/user-external-store.service';
import { DrawerService } from '../components/drawer/drawer.service';
import { TSelectExternals } from '../entries-list/entries-list.component';

@Injectable()
export class UserExternalService {

  constructor(
    @Inject(UserExternalApiService) private api: UserExternalApiService,
    @Inject(UserExternalStoreService) private store: UserExternalStoreService,
  ) { }

  public getUserExternals (): Observable<IGetUserExternalsApi[]> {
    return this.api.getUserExternalsApi()
    .pipe(
      tap((res: IGetUserExternalsApi[]) => this.store.setUserExternals(res)),
    )
  }

  public getServiceNameById (externalServiceId: number | string): string{
    const found = this.store.getUserExternals().find(el => el.id === Number(externalServiceId))
    if (!found) {
      throw new Error(`cannot find external service by id: ${externalServiceId}`)
    }
    return found.name
  }
}
