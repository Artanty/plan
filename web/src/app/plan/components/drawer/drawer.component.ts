import { AfterContentInit, AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges, ViewChild } from '@angular/core';
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
export class DrawerComponent  implements OnInit, AfterViewInit {
  @Input() id!: string
  @Input() overlay: boolean = true
  @Input() side: string = 'top'
  @Input() closeOnClickOutside: boolean = false
  @ViewChild('wrapper', { static: false }) wrapper!: ElementRef;
  @ContentChild('projectedContent', { static: false }) projectedContent!: ElementRef;

  isVisible$!: Observable<boolean>

  constructor(
    public elementRef: ElementRef,
    private resizeService: ResizeService,
    private drawerService: DrawerService
  ) {

  }

  ngOnInit (): void {
    this.isVisible$ = this.drawerService.listenDrawerState(this.id)
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.overlay) {
        this.wrapper.nativeElement.style.height = `100%`
      } else {
        const height = this.wrapper.nativeElement.offsetHeight;
        this.wrapper.nativeElement.style.height = `${height}px`
      }
    }, 1000)
    this.resizeService.listenSpy('rootComponent')
    .subscribe(res => {
      if (this.side === 'top') {
        this.wrapper.nativeElement.style.width = `${res.width}px`
      }
    })
    this.drawerService.registerDrawer(this.wrapper, this.id)
  }

  handleClickOutside(event: any) {
    if (this.closeOnClickOutside) {
      if (event !== this.id) {
        this.drawerService.hide(this.id)
      }
    }
  }
}


