import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, Input, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  standalone: true,
  providers: [
    CommonModule,
    ReactiveFormsModule
  ],
  imports: [ReactiveFormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  styleUrls: [
    './date-picker.component.scss',
    './../select/select.component.scss'
  ]
})
export class DatePickerComponent {
  @Output() selectedDate = new EventEmitter<string>();
  @Input() set reset(value: boolean) {
    if (value) {
      this.resetDate();
    }
  }

  // New input setter to set the date from a string in 'YYYY-MM-DD' format
  @Input() set date(dateString: string) {
    if (dateString) {
      const parts = dateString.split('T')[0]?.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);
        this.dateForm.get('year')?.setValue(year);
        this.dateForm.get('month')?.setValue(month);
        this.updateDaysInMonth(month, year);
        this.dateForm.get('day')?.setValue(day);
      }
    }
  }

  dateForm: FormGroup;
  days: number[] = [];
  months = Array.from({ length: 12 }, (_, i) => i + 1);
  years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i);

  constructor() {
    const today = new Date();
    this.dateForm = new FormGroup({
      day: new FormControl(today.getDate(), Validators.required),
      month: new FormControl(today.getMonth() + 1, Validators.required),
      year: new FormControl(today.getFullYear(), Validators.required)
    });

    this.updateDaysInMonth(today.getMonth() + 1, today.getFullYear());
    this.emitSelectedDate();

    this.dateForm.get('day')?.valueChanges.subscribe((day) => {
      this.emitSelectedDate();
    });

    this.dateForm.get('month')?.valueChanges.subscribe((month) => {
      const year = this.dateForm.get('year')?.value;
      this.updateDaysInMonth(month, year);
      this.emitSelectedDate();
    });

    this.dateForm.get('year')?.valueChanges.subscribe((year) => {
      const month = this.dateForm.get('month')?.value;
      this.updateDaysInMonth(month, year);
      this.emitSelectedDate();
    });
  }

  resetDate(): void {
    const today = new Date();
    this.dateForm.get('day')?.setValue(today.getDate());
    this.dateForm.get('month')?.setValue(today.getMonth() + 1);
    this.dateForm.get('year')?.setValue(today.getFullYear());
    this.updateDaysInMonth(today.getMonth() + 1, today.getFullYear());
    this.emitSelectedDate();
  }

  updateDaysInMonth(month: number, year: number): void {
    const totalDays = new Date(year, month, 0).getDate();
    this.days = Array.from({ length: totalDays }, (_, i) => i + 1);

    const selectedDay = this.dateForm.get('day')?.value;
    if (selectedDay > totalDays) {
      this.dateForm.get('day')?.setValue(1);
    }
  }

  emitSelectedDate(): void {
    if (this.dateForm.valid) {
      const selectedDate = new Date(this.dateForm.value.year, this.dateForm.value.month - 1, this.dateForm.value.day);
      this.selectedDate.emit(this.formatDate(selectedDate));
    }
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  }
}
