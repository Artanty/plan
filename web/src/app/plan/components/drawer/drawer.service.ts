import { ChangeDetectorRef, ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, distinctUntilChanged, filter, map, of, switchMap, take, tap } from 'rxjs';
import { TElem } from '../../services/resize.service';

export interface IDrawer { isVisible: boolean }
export type TDrawerMap = Record<string, IDrawer>
export type TTriggerMap = { [key: string]: ElementRef[] };


@Injectable({
  providedIn: 'root'
})
export class DrawerService {

  private drawers$ = new BehaviorSubject<TDrawerMap | null>(null)

  constructor() {

  }

  public showAfterInit (name: string) {
    this.listenDrawerState(name)
    .pipe(
      take(1),
      distinctUntilChanged(),
      tap(() => {
        this.show(name)
      })
    ).subscribe()
  }

  public listenDrawers (): Observable<TDrawerMap> {
    return this.drawers$.asObservable().pipe(filter(Boolean))
  }

  public listenDrawerState (name: string): Observable<boolean> {
    return this.drawers$.asObservable()
    .pipe(
      filter(Boolean),
      filter(res => res[name] !== undefined),
      map(res => {
        return res[name]
      }),
      map(res => {
        return res['isVisible']
      }),
      distinctUntilChanged()
    )
  }

  public getDrawerState (name: string): boolean {
    const allDrawers = this.drawers$.value
    if (allDrawers !==null) {
      const currentDrawer = allDrawers[name]
      if (currentDrawer) {
        return currentDrawer.isVisible
      }
    }
    return false
  }

  public show (name: string) {
    const drawer = this.getDrawer(name)
    drawer.isVisible = true
    const drawers = this.getDrawers() as TDrawerMap
    drawers[name] = drawer
    this.drawers$.next(drawers)
  }

  public hide (name: string) {
    const drawer = this.getDrawer(name)
    drawer.isVisible = false
    const drawers = this.getDrawers() as TDrawerMap
    drawers[name] = drawer
    this.drawers$.next(drawers)
  }

  // todo + initial value
  public registerDrawer (el: TElem, name: string) {
    const drawerValue = this.createNewDrawer()
    let drawers = this.getDrawers()
    if (!drawers) {
      drawers = {
        [name]: drawerValue
      }
    } else {
      if (drawers[name]) {
        this.unregisterDrawer(name)
      }
      drawers[name] = drawerValue
    }
    this.drawers$.next(drawers)
  }

  private getDrawers (): TDrawerMap | null {
    return this.drawers$.getValue()
  }

  private getDrawer (name: string): IDrawer {
    const drawer = this.getDrawers()?.[name]
    if (!drawer) {
      throw new Error(`No drawer registered with name: ${name}`)
    }
    return drawer
  }

  private unregisterDrawer (name: string) {
    const drawers = this.getDrawers()
    if (drawers && drawers[name]) {
      delete drawers[name]
      this.drawers$.next(drawers)
    } else {
      throw new Error(`Can't kill. No drawer registered with name: ${name}`)
    }
  }

  private createNewDrawer (): IDrawer {
    return {
      isVisible: false,
      // listen$: of(false)
    }
  }
}
