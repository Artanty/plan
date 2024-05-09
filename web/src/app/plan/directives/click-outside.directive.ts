import { Directive, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';

@Directive({
  selector: '[clickOutside]'
})
export class ClickOutsideDirective {
  @Output() clickOutside = new EventEmitter<string>();

  constructor(private elementRef: ElementRef) {}

  // @HostListener('document:click', ['$event.target'])
  // public onClick(target: any) {
  //   const clickedInside = this.elementRef.nativeElement.contains(target);
  //   if (!clickedInside) {
  //     this.clickOutside.emit(target);
  //   }
  // }

  @HostListener('document:click', ['$event.target'])
  public onClick(target: any) {
    const clickedInside = this.elementRef.nativeElement.contains(target);
    const triggerAttr = this.getDataTriggerAttribute(target);

    if (!clickedInside) {
      this.clickOutside.emit(triggerAttr);
    }
  }

  private getDataTriggerAttribute(element: any): string | undefined {
    try {
      if (element instanceof HTMLElement) {
        while (element && element.tagName !== 'BODY' && element.tagName !== 'APP-PLAN') {
          if (element.hasAttribute('data-trigger')) {
            return element.getAttribute('data-trigger');
          }
          element = element.parentNode;
        }
      }
    } catch(e) {
      console.log('wrong element in parent loop')
      console.log(e)
    }
    return undefined;
  }
}
