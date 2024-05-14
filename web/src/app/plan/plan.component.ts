import { AfterViewInit, Component, ElementRef, Inject, Optional, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { ResizeService } from './services/resize.service';
import { IProductSize, PRODUCT_SIZE } from '../app.config';

@Component({
  selector: 'app-plan',
  templateUrl: './plan.component.html',
  styleUrl: './plan.component.scss',
})
export class PlanComponent implements AfterViewInit {

  @ViewChild('wrapper', { static: false })
  wrapper?: ElementRef<HTMLElement>;

  constructor(
    public elementRef: ElementRef,
    private resizeService: ResizeService,
    @Optional() @Inject(PRODUCT_SIZE) private productSize$: Observable<IProductSize>
  ) {}

  ngAfterViewInit() {
    this.resizeService.setSpy(this.wrapper!.nativeElement, 'rootComponent')
    this.productSize$?.subscribe(res=> {
      this.adjustHeight(res);
    })
  }

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


