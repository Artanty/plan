import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IGetUserExternalsApi } from '../../../../../../contracts/getUserExternals';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class UserExternalApiService {

  constructor(
    @Inject(HttpClient) private http: HttpClient
  ) { }

  public getUserExternalsApi (): Observable<IGetUserExternalsApi[]> {
    return this.http.get<IGetUserExternalsApi[]>(`${process.env['SERVER_URL']}/userExternals`)
  }
}
