import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, filter, map } from 'rxjs';
import { TElem } from '../../services/resize.service';

export interface IDrawer {
  isVisible: boolean
}

// todo upd 2 Map
export type TDrawerMap = Record<string, IDrawer>

@Injectable({
  providedIn: 'root'
})
export class DrawerService {

  private drawers$ = new BehaviorSubject<TDrawerMap | null>(null)

  constructor() { }

  public listenDrawers (): Observable<TDrawerMap> {
    return this.drawers$.asObservable().pipe(filter(Boolean))
  }

  public getDrawerState (name: string): Observable<boolean> {
    return this.drawers$.asObservable()
    .pipe(
      filter(Boolean),
      map(res => res[name]),
      map(res => res['isVisible'])
    )
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

  private createNewDrawer () {
    return {
      isVisible: false
    }
  }
}
