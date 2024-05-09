import { Inject, Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '../services/translation.service';


@Pipe({
  name: 'translate'
})
export class TranslatePipe implements PipeTransform {
  constructor(
    @Inject(TranslationService) private translationService: TranslationService

    ) {}

  transform(value: string): string {
    return this.translationService.translate(value);
  }
}
