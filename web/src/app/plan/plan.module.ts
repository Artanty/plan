import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlanComponent } from './plan.component';
import { RouterModule, Routes } from '@angular/router';
import { EntryFormComponent } from './entry-form/entry-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { EntriesListComponent } from './entries-list/entries-list.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { Observable, debounceTime, map, distinctUntilChanged } from 'rxjs';
import { ResizeService } from './services/resize.service';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { ExternalFormComponent } from './external-form/external-form.component';
import { ExternalListComponent } from './external-list/external-list.component';
import { UserExternalService } from './services/user-external.service';
import { UserExternalApiService } from './api/userExternal/user-external-api.service';
import { UserExternalStoreService } from './store/userExternal/user-external-store.service';
import { LoaderComponent } from './components/loader/loader.component';
import { UserExternalsResolver } from './resolvers/user-externals.resolver';
import { TaskApiService } from './api/task/task-api.service';
import { TaskService } from './services/task.service';
import { StatusSelectComponent } from './components/status-select/status-select.component';
import { TranslationService } from './services/translation.service';
import { TranslatePipe } from './pipes/translate.pipe';
import { ClickOutsideDirective } from './directives/click-outside.directive';
import { TaskFormComponent } from './components/task-form/task-form.component';
import { TaskReadonlyComponent } from './components/task-readonly/task-readonly.component';

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
    component: PlanComponent,
    resolve: { userExternals: UserExternalsResolver }
  }
]

@NgModule({
  declarations: [
    PlanComponent,
    EntryFormComponent,
    ExternalFormComponent,
    EntriesListComponent,
    ExternalListComponent,
    DrawerComponent,
    LoaderComponent,
    StatusSelectComponent,
    TranslatePipe,
    ClickOutsideDirective
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forChild(remoteRoutes),
    DatePickerComponent,
    TaskFormComponent,
    TaskReadonlyComponent
  ],
  providers: [
    // {
    //   provide: RESIZE,
    //   useFactory: (DOCUMENT: Document) => createResizeObservable(DOCUMENT.documentElement),
    //   deps: [DOCUMENT]
    // },
    ResizeService,
    UserExternalService,
    UserExternalApiService,
    UserExternalStoreService,
    UserExternalsResolver,
    TaskService,
    TaskApiService,
    TranslationService

  ],
  exports: [
    PlanComponent
  ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
})
export class PlanModule {}
