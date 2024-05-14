import { Component, Inject, Optional } from '@angular/core';
import { TaskFormComponent } from '../task-form/task-form.component';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { TBaseOption, getStatusId, getStatusOptions, greaterThanZeroValidator, taskStatusOptions as statuses } from '../../constants';
import { TSelectExternals } from '../../entries-list/entries-list.component';
import { HttpClient } from '@angular/common/http';
import { TranslatePipe } from '../../pipes/translate.pipe';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-task-readonly',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TaskFormComponent],
  providers: [TranslatePipe, TranslationService],
  templateUrl: './task-readonly.component.html',
  styleUrl: './task-readonly.component.scss'
})
export class TaskReadonlyComponent {
  form: FormGroup;
  resetDatePicker: boolean = false
  due_date: string = new Date().toISOString().split('T')[0]
  externals$: Observable<TSelectExternals[]>;
  taskStatusOptions: TBaseOption[] = [
    { name: 'Статус', id: -1 },
    ...getStatusOptions()
  ]
  constructor (
    private fb: FormBuilder,
    @Inject(HttpClient) private http: HttpClient,
    @Optional() @Inject('TASK_DATA') private taskData: any,
    private translationService: TranslationService
  ) {
    this.resetDatePicker = true // do not remove
    this.form = this.fb.group({
      title: ['123', Validators.required],
      description: [''],
      externalServiceId: [-1, [Validators.required, greaterThanZeroValidator()]],
      externalServiceName: [''],
      status: [-1, [Validators.required, greaterThanZeroValidator()]],
      statusName: [''],
      external_task_id: [''],
      id: ['']
    });
    this.externals$ = of([{ id: -1, name: 'Проект' }])
    if (this.taskData) {
      try {
        console.log(this.taskData)
        this.setTaskData(this.taskData)
      } catch (e) {
        console.log(e)
      }
    }
  }

  setTaskData (taskData: any) {
    this.form.patchValue({
      title: taskData.title,
      description: taskData.description,
      externalServiceId: taskData.service_id,
      externalServiceName: taskData.name,
      status: getStatusId(taskData.status),
      statusName: new TranslatePipe(this.translationService).transform(taskData.status),
      external_task_id: taskData.external_task_id,
      id: taskData.id
    })
  }

  getFullTask (exteranalTaskId: string) {
    return this.http.get<any>(`${process.env['SERVER_URL']}/tasks/full${exteranalTaskId}`)

  }
}
