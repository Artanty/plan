import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { IProductSize, SCAFFOLD_PRODUCT_SIZE } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  constructor (
    @Inject(SCAFFOLD_PRODUCT_SIZE) private sizeControl$: BehaviorSubject<IProductSize>
  ) {}

  resize() {
    const currentValue = this.sizeControl$.getValue()
    const nextValue = currentValue.width === 500
    ? { width: 400, height: 300 }
    : { width: 500, height: 600 }
    this.sizeControl$.next(nextValue)
  }
}
