import { Injectable } from '@angular/core';

@Injectable()
export class TranslationService {
  private dictionary: any = {
    'To Do': 'TO DO',
    'In Progress': 'В процессе',
    'Completed': 'Сделано'
  };

  translate(value: string): string {
    return this.dictionary[value] || value;
  }
}
