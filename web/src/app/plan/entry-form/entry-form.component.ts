import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EMPTY, Observable, catchError, finalize, map, share, shareReplay, switchMap, tap } from 'rxjs';
import { DrawerService } from '../components/drawer/drawer.service';
import { ICreateTaskApi } from '../../../../../contracts/createTask'
import { IEditTaskApi } from '../../../../../contracts/editTask'
import { TBaseOption, greaterThanZeroValidator, mapSelectOptions, prepareStatus4Api, taskStatusOptions as statuses } from '../constants'
import { IGetUserExternalsApi } from '../../../../../contracts/getUserExternals';
import { TSelectExternals } from '../entries-list/entries-list.component';
import { ITaskFormValue, TaskStoreService } from '../store/task/task-store.service';
import { UserExternalStoreService } from '../store/userExternal/user-external-store.service';
import { UserExternalService } from '../services/user-external.service';
import { TaskService } from '../services/task.service';
import { TaskApiService } from '../api/task/task-api.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: [
    './entry-form.component.scss',
    './../components/select/select.component.scss'
  ]
})
export class EntryFormComponent {
  Number = Number
  form: FormGroup;
  externals$: Observable<TSelectExternals[]>;
  taskStatusOptions: TBaseOption[] = [
    { name: 'Статус', id: -1 },
    ...statuses.map((el: string, i: number) => ({ id: i + 1, name: el }))
  ]
  resetDatePicker: boolean = false
  due_date: string = new Date().toISOString().split('T')[0]
  due_date_result: string = ''

  constructor(
    private fb: FormBuilder,
    @Inject(HttpClient) private http: HttpClient,
    @Inject(DrawerService) private drawerService: DrawerService,
    @Inject(TaskStoreService) private taskStore: TaskStoreService,
    @Inject(UserExternalStoreService) private userExternalStore: UserExternalStoreService,
    @Inject(UserExternalService) private userExternalService: UserExternalService,
    @Inject(TaskService) private taskService: TaskService,
    @Inject(TaskApiService) private taskApi: TaskApiService
  ) {
    // date
    this.resetDatePicker = true // do not remove

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      externalServiceId: [-1, [Validators.required, greaterThanZeroValidator()]],
      externalServiceName: [''],
      status: [-1, [Validators.required, greaterThanZeroValidator()]],
      external_task_id: [''],
      id: ['']
    });

    this.externals$ = this.userExternalStore.listenUserExternals().pipe(
      map(res => {
        return [
          { id: -1, name: 'Проект' },
          ...mapSelectOptions(res)
        ]
      })
    )
    this.form.valueChanges.subscribe(res => {
      this.resetValidation()
    })
    // this.form.controls['externalServiceId'].
    // this.form.patchValue({
    //   title: '* back: sse fix x-accel-buffering: no;',
    //   description: 'fixed problem with SSE freezing',
    //   status: -1,
    //   due_date: '2024-04-28',
    //   externalServiceId: 1,
    //   externalServiceName: 'doro@github'
    // })
    this.taskStore.listenTaskToEdit().subscribe((res: ITaskFormValue | null) => {
      if (res) {
        this.form.patchValue(res)
      } else {
        this.onReset()
        const data = this.getDefaultFormData()
        this.form.patchValue(data)
      }
    })
  }

  private getDefaultFormData(): ITaskFormValue {
    const externalFilterVal = this.userExternalStore.getUserExternalFilter()
    const externalServiceName = externalFilterVal
    ? this.userExternalService.getServiceNameById(externalFilterVal)
    : ''
    const initialData: ITaskFormValue = {
      title: '',
      description: '',
      status: 1,
      due_date: new Date().toISOString().split('T')[0],
      externalServiceId: externalFilterVal || -1,
      externalServiceName: externalServiceName
    }
    return initialData
  }

  onSubmit() {
    if (this.form.valid) {
      if (this.form.value.id) {
        this.prepareAndEditTask()
      } else {
        this.prepareAndCreateTask()
      }
    } else {
      this.form.markAllAsTouched()
    }
  }

  onCancel() {
    this.onReset()
    this.back()
  }

  onReset () {
    this.form.reset({
      externalServiceId: -1,
      status: -1
    });
    this.resetDatePicker = true
  }

  back () {
    this.drawerService.hide('createTask')
  }

  prepareAndCreateTask () {
    this.drawerService.show('loader')
    const taskData: any | ICreateTaskApi = {
      title: this.form.value.title,
      description: this.form.value.description,
      status: prepareStatus4Api(this.form.value.status),
      due_date: this.due_date_result,
      externalServiceId: this.form.value.externalServiceId,
      externalServiceName: this.userExternalService.getServiceNameById(this.form.value.externalServiceId)
    };
    this.taskApi.createTask(taskData)
    .pipe(
      switchMap(() => this.taskService.getTasksByService(taskData.externalServiceId)),
      catchError((err: any) => this.handleError(err)),
      finalize(() => {
        this.back()
        this.drawerService.hide('loader')
      })
    )
    .subscribe()
  }

  prepareAndEditTask() {
    this.drawerService.show('loader')
    const taskData: IEditTaskApi = {
      title: this.form.value.title,
      description: this.form.value.description,
      status: prepareStatus4Api(this.form.value.status),
      due_date: this.due_date_result,
    };
    this.taskApi.editTask(this.form.value.id, taskData)
    .pipe(
      switchMap(() => this.taskService.getTasksByService(this.form.value.externalServiceId)),
      catchError((err: any) => this.handleError(err)),
      finalize(() => {
        this.back()
        this.drawerService.hide('loader')
      })
    )
    .subscribe()
  }

  private resetValidation() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  public onSelectDate (data: string) {
    this.due_date_result = data
  }

  private handleError (err: string | any): Observable<never> {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error(errorMessage)
    return EMPTY
  }
}
