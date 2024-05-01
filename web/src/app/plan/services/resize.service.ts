import { Injectable, Inject, Optional, ElementRef, ChangeDetectorRef } from '@angular/core';
import { BehaviorSubject, Observable, filter, startWith, switchMap, takeWhile, tap } from 'rxjs';
import { TResizeResult, createResizeObservable } from '../plan.module';

export type TElem = Element | ElementRef
export type ISpy = Record<string, Observable<TResizeResult>>

@Injectable()
export class ResizeService {

  private spies$ = new BehaviorSubject<ISpy | null>(null)

  constructor() {}

  public listenSpies () {
    return this.spies$.asObservable()
  }

  public getSpies () {
    return this.spies$.getValue()
  }

  public setSpy (el: TElem, spyName: string) {
    let spies = this.getSpies()
    if (spies && spies[spyName]) {
      this.killSpy(spies, spyName)
    }
    if (!spies) {
      spies = {}
    }
    spies[spyName] = createResizeObservable(el)
    this.spies$.next(spies)
  }

  public killSpy (spies: ISpy, spyName: string) {
    (spies as any)[spyName] = undefined
    delete spies[spyName]
  }

  public listenSpy(name: string): Observable<TResizeResult> {
    return this.listenSpies().pipe(
      filter(Boolean),
      takeWhile(res => res?.[name] !== undefined),
      switchMap(res=> res[name]),
      startWith({width: 0, height: 0}),
    )
  }
}
