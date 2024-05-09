import { Injectable } from '@angular/core';
import { IGetUserExternalsApi } from '../../../../../../contracts/getUserExternals';
import { BehaviorSubject, Observable, Subject, filter, fromEvent, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserExternalStoreService {

  private userExternals$ = new BehaviorSubject<IGetUserExternalsApi[] | null>(null)

  constructor() { }

  public getUserExternals (): IGetUserExternalsApi[] {
    return this.userExternals$.getValue() || []
  }

  public setUserExternals (data: IGetUserExternalsApi[]): void {
    this.userExternals$.next(data)
  }

  public listenUserExternals (): Observable<IGetUserExternalsApi[]> {
    return this.userExternals$.asObservable().pipe(filter(Boolean))
  }

  setUserExternalFilter(data: number) {
    if (typeof data !== 'number') throw new Error(`userExternalFilter must be number, ${data} received`)
    localStorage.setItem('userExternalFilter', String(data))
  }

  getUserExternalFilter(): number {
    const localStorageValue = localStorage.getItem('userExternalFilter')
    return localStorageValue ? Number(localStorageValue) : -1
  }

  listenUserExternalFilter(): Observable<number> {
    return fromEvent<StorageEvent>(window, 'storage').pipe(
      filter(event => event.storageArea === localStorage),
      filter(event => event.key === 'userExternalFilter'),
      map(event => {
        const { newValue } = event;
        return newValue ? JSON.parse(newValue) : -1;
      })
    );
  }
}
