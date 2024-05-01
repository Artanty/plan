import { DOCUMENT } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, Inject, InjectionToken, Provider, ViewChild, forwardRef, inject } from '@angular/core';
// import { RESIZE, fromResize } from './constants';
import { Observable, debounceTime, map } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { RESIZE, TResizeResult, createResizeObservable } from './plan.module';
import { ResizeService } from './services/resize.service';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss',
  // providers: [
  //   {
  //     provide: RESIZE_WIDTH2,
  //     useFactory: (elementRef: ElementRef) => createResizeObservable(elementRef, 'width'),
  //     deps: [ElementRef]
  //   }
  // ]
  // providers: [
  //   {
  //     provide: RESIZE_WIDTH2,
  //     useFactory: (elementRef: ElementRef) => elementRef.nativeElement.offsetWidth,
  //     deps: [ElementRef]
  //   }
  // ]


})
export class PlanComponent {

  @ViewChild('wrapper', { static: false })
  wrapper?: ElementRef<HTMLElement>;

  hostElementWidth: number = 0

  constructor(
    public elementRef: ElementRef,
    private resizeService: ResizeService,
    private cdr: ChangeDetectorRef,
    // @Inject(RESIZE_WIDTH2) private resizeWidth$: Observable<number>,

    // @Inject(RESIZE_WIDTH) private resizeWidth$: Observable<number>,
    // @Inject(RESIZE_HEIGHT) private resizeHeight$: Observable<number>,
    // @Inject(RESIZE_BOTH) private resizeBoth$: Observable<TResizeResult>
  ) {

  }

  ngAfterViewInit() {
    this.resizeService.setSpy(this.wrapper!.nativeElement, 'rootComponent')
  }
}


