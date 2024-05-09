import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, Inject, InjectionToken, Provider, ViewChild, forwardRef, inject } from '@angular/core';
// import { RESIZE, fromResize } from './constants';
import { Observable, debounceTime, map } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { RESIZE, TResizeResult, createResizeObservable } from './plan.module';
import { ResizeService } from './services/resize.service';
import { HttpClient } from '@angular/common/http';
import { PRODUCT_SIZE, IProductSize } from '../app.config';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
export class PlanComponent implements AfterViewInit {

  @ViewChild('wrapper', { static: false })
  wrapper?: ElementRef<HTMLElement>;

  // private baseUrl = 'https://api.github.com';
  constructor(
    public elementRef: ElementRef,
    private resizeService: ResizeService,
    private http: HttpClient,
    @Inject(PRODUCT_SIZE) private productSize$: Observable<IProductSize>
  ) {

    // this.getCommits(
    //   'Artanty', 'doro', '', '2023-01-01', '2024-05-01'
    // ).subscribe(res => {
    //   console.log(res)
    // })
  }

  ngAfterViewInit() {
    this.resizeService.setSpy(this.wrapper!.nativeElement, 'rootComponent')

    this.productSize$.subscribe(res=> {
      this.adjustHeight(res);
    })
  }

  // getCommits(owner: string, repo: string, user: string, startDate: string, endDate: string): Observable<any> {
  //   const url = `${this.baseUrl}/search/commits?q=repo:${owner}/${repo}&order=desc`;
  //   const url = `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}`
  //   return this.http.get(url, {
  //     headers: {
  //       Accept: 'application/vnd.github.v3+json'
  //     }
  //   });
  // }

  // @HostListener('window:resize')
  // onWindowResize() {
  //   this.adjustHeight();
  // }

  private adjustHeight(size: IProductSize) {
    setTimeout(() => {
      if (this.wrapper && this.wrapper.nativeElement.parentElement) {
        this.wrapper.nativeElement.parentElement.style.maxWidth = `${size.width}px`
        this.wrapper.nativeElement.parentElement.style.height = `${size.height}px`
      } else {
        throw new Error('no wrapper or its parent element in plan component')
      }
    }, 1000)
  }
}


