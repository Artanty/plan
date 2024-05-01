export const taskStatusOptions = ['To Do', 'In Progress', 'Completed']

// todo:
// export enum ETaskStatusOptions {
//   TODO,
//   IN_PROGRESS,
//   COMPLETED
// }


import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { TSelectExternals } from './entries-list/entries-list.component';

export function greaterThanZeroValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Check if the control value is a number and greater than 0
    if (control.value !== null && control.value !== '' && !isNaN(control.value) && control.value > 0) {
      return null; // Valid, return null
    } else {
      // Invalid, return an error object
      return { greaterThanZero: true };
    }
  };
}


interface AnySelectOption {
  id: number;
  name: string;
  [key: string]: any;
}

export function mapSelectOptions (optionsArr: AnySelectOption[]) {
  return optionsArr.map(el => ({ id: el.id, name: el.name }))
}

export type TBaseOption = { name: string, id: number }

export function getStatusOptions (): TBaseOption[] {
  return taskStatusOptions.map((el: string, i: number) => ({ id: i + 1, name: el }))
}

export function prepareStatus4Api (selectedId: number | string): string {
  const found = getStatusOptions()?.find(el => el.id === Number(selectedId))
  if (!found) {
    throw new Error('wrong id of status option')
  }
  return found?.name
}


export function getServiceNameById (externalServices: TSelectExternals[], externalServiceId: number | string): string {
  const found = externalServices.find(el => el.id === Number(externalServiceId))
  if (!found) {
    throw new Error(`cannot find external service by id: ${externalServiceId}`)
  }
  return found.name
}
