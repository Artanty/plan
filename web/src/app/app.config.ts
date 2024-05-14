import { ApplicationConfig, InjectionToken } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IProductSize {
  width: number,
  height: number
}

export const PRODUCT_SIZE = new InjectionToken<Observable<IProductSize>>('');
export const SCAFFOLD_PRODUCT_SIZE = new InjectionToken<BehaviorSubject<IProductSize>>('');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: SCAFFOLD_PRODUCT_SIZE,
      useValue: new BehaviorSubject({ width: 500, height: 600 })
    },
    {
      provide: PRODUCT_SIZE,
      useFactory: (size$: BehaviorSubject<IProductSize>) => size$.asObservable(),
      deps: [SCAFFOLD_PRODUCT_SIZE]
    },
  ]
};
