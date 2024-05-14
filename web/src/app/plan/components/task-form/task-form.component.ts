import { CUSTOM_ELEMENTS_SCHEMA, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { greaterThanZeroValidator } from '../../constants';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { DatePickerComponent } from '../date-picker/date-picker.component';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: [
    './task-form.component.scss',
    './../select/select.component.scss'
  ],
  standalone: true,
  providers: [
    ReactiveFormsModule,
    CommonModule,
  ],
  imports: [CommonModule, ReactiveFormsModule, DatePickerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TaskFormComponent {
  @Output() public onSubmit = new EventEmitter<void>()
  @Output() public onBack = new EventEmitter<void>()
  @Output() public onReset = new EventEmitter<void>()
  @Output() public onCancel = new EventEmitter<void>()
  @Output() public onSelectDate = new EventEmitter<any>()
  @Input() public readonly = false
  @Input() public externals$?: Observable<any>
  @Input() public taskStatusOptions: any[] = []
  @Input() set doResetDatePicker (data: any) {
    this.resetDatePicker = data
  }
  @Input() set fg (data: any) {
    this.form = data
  }
  due_date: string = ''
  @Input() set date (val: any) {
    this.due_date = val
  }
  public form: FormGroup;
  public resetDatePicker: boolean = false

  constructor(
    private fb: FormBuilder,
  ) {
    console.log('readonly ' + this.readonly)
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      externalServiceId: [-1, [Validators.required, greaterThanZeroValidator()]],
      externalServiceName: [''],
      status: [-1, [Validators.required, greaterThanZeroValidator()]],
      statusName: [''],
      external_task_id: [''],
      id: ['']
    });
  }

}
