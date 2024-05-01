import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges, ViewChild } from '@angular/core';
import { RESIZE, TResizeResult, createResizeObservable } from '../../plan.module';
import { Subscription, Observable, switchMap, takeWhile, filter, startWith, tap, map } from 'rxjs';
import { ResizeService } from '../../services/resize.service';
import { DrawerService } from './drawer.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerComponent  implements AfterViewInit {

  @ViewChild('wrapper') drawerWrapperRef!: ElementRef;
  isVisible$: Observable<boolean>

  constructor(
    public elementRef: ElementRef,
    private resizeService: ResizeService,
    private drawerService: DrawerService
  ) {
    this.isVisible$ = this.drawerService.getDrawerState('createTask')
  }

  ngAfterViewInit(): void {
    this.resizeService.listenSpy('rootComponent')
    .subscribe(res => {
      this.drawerWrapperRef.nativeElement.style.width = `${res.width}px`
    })
    this.drawerService.registerDrawer(this.drawerWrapperRef, 'createTask')
  }
}


