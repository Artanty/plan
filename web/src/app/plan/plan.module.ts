import { ElementRef, InjectionToken, NgModule, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanComponent } from './plan.component';
import { RouterModule, Routes } from '@angular/router';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EntriesListComponent } from './entries-list/entries-list.component';
import { DrawerComponent } from './components/drawer/drawer.component';

import { DOCUMENT } from '@angular/common';
import { Observable, debounceTime, map, distinctUntilChanged } from 'rxjs';
import { ResizeService } from './services/resize.service';

export type TResizeResult = { width: number, height: number}

export function createResizeObservable(elementProp: Element | ElementRef): Observable<TResizeResult> {
  const element: Element = (elementProp instanceof ElementRef)
  ? elementProp.nativeElement
  : elementProp
  return new Observable<ResizeObserverEntry>(subscriber => {
    const ro = new ResizeObserver(([event]) => subscriber.next(event));
    ro.observe(element);

    return () => ro.unobserve(element);
  })
  .pipe(
    debounceTime(300),
    map((res: ResizeObserverEntry) => {
      return { width: Math.round(res.contentRect['width']), height: Math.round(res.contentRect['height']) }
    }),
    distinctUntilChanged()
  );
}

export const RESIZE = new InjectionToken<Observable<TResizeResult>>('RESIZE');


export const remoteRoutes: Routes = [
  {
    path: '',
    component: PlanComponent
  }
]

@NgModule({
  declarations: [
    PlanComponent,
    EntryFormComponent,
    EntriesListComponent,
    DrawerComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forChild(remoteRoutes)
  ],
  providers: [
    // {
    //   provide: RESIZE,
    //   useFactory: (DOCUMENT: Document) => createResizeObservable(DOCUMENT.documentElement),
    //   deps: [DOCUMENT]
    // },
    ResizeService
  ]
})
export class PlanModule {
  constructor () {
    // console.log(2)
  }
}
