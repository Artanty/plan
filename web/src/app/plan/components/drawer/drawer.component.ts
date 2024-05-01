import { AfterViewChecked, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, Optional, SimpleChanges, ViewChild } from '@angular/core';
import { RESIZE, TResizeResult, createResizeObservable } from '../../plan.module';
import { Subscription, Observable, switchMap, takeWhile, filter, startWith, tap, map } from 'rxjs';
import { ResizeService } from '../../services/resize.service';

@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrl: './drawer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DrawerComponent  implements AfterViewInit {
  @Input() isOpen = false;
  @ViewChild('wrapper')
  myElementRef!: ElementRef;

  constructor(
    public elementRef: ElementRef,
    private resizeService: ResizeService,
  ) {}

  ngAfterViewInit(): void {
    this.resizeService.listenSpies().pipe(
      filter(Boolean),
      takeWhile(res => res?.['rootComponent'] !== undefined),
      switchMap(res=> res['rootComponent']),
      startWith({width: 0, height: 0}),
    ).subscribe(res => {
      console.log(res)
      this.myElementRef.nativeElement.style.width = `${res.width}px`
    })
  }
}


