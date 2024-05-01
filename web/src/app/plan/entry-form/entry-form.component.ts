import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, share, shareReplay, switchMap, tap } from 'rxjs';
import { DrawerService } from '../components/drawer/drawer.service';
import { ICreateTaskApi } from '../../../../../contracts/createTask'
import { TBaseOption, getServiceNameById, greaterThanZeroValidator, mapSelectOptions, prepareStatus4Api, taskStatusOptions as statuses } from '../constants'
import { IGetUserExternalsApi } from '../../../../../contracts/getUserExternals';
import { TSelectExternals } from '../entries-list/entries-list.component';


@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: [
    './entry-form.component.scss',
    './../components/select/select.component.scss'
  ]
})
export class EntryFormComponent {
  form: FormGroup;
  externals$: Observable<TSelectExternals[]>;
  taskStatusOptions: TBaseOption[] = [
    { name: 'Статус', id: -1 },
    ...statuses.map((el: string, i: number) => ({ id: i + 1, name: el }))
  ]
  resetDatePicker: boolean = false
  due_date: string = ''

  constructor(
    private fb: FormBuilder,
    @Inject(HttpClient) private http: HttpClient,
    private drawerService: DrawerService
  ) {
    // date
    this.resetDatePicker = true // do not remove

    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      externalServiceId: [-1, [Validators.required, greaterThanZeroValidator()]],
      externalServiceName: [''],
      status: [-1, [Validators.required, greaterThanZeroValidator()]]
    });

    this.externals$ = this.getExternals()
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
  }
  creds: any = ''

  onSubmit() {
    if (this.form.valid) {
      this.prepareAndCreateTask()
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
    this.getExternals().pipe(
      map((ext: TSelectExternals[]) => {
        const taskData: ICreateTaskApi = {
          title: this.form.value.title,
          description: this.form.value.description,
          status: prepareStatus4Api(this.form.value.status),
          due_date: this.due_date,
          externalServiceId: this.form.value.externalServiceId,
          externalServiceName: getServiceNameById(ext, this.form.value.externalServiceId)
        };
        console.log(taskData)
        return taskData
      }),
      switchMap(this.createTaskApi.bind(this))
    ).subscribe({
      next: (res: any) => {
        console.log(res)
      }
    })
  }


  createTaskApi(task: ICreateTaskApi) {

    // const taskData = {
    //   title: 'Example Task',
    //   description: 'This is an example task description.',
    //   status: 'In Progress',
    //   due_date: '2022-12-31',
    //   externalServiceId: 1,
    //   externalServiceName: 'doro@github'
    // };

    return this.http.post(`${process.env['SERVER_URL']}/tasks`, task)
  }

  private resetValidation() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  public onSelectDate (data: string) {
    this.due_date = data
  }

  private getExternals(): Observable<TSelectExternals[]> {
    if (!this.externals$) {
      this.externals$ = this.http.get<IGetUserExternalsApi[]>(`${process.env['SERVER_URL']}/userExternals`).pipe(
        shareReplay(1),
        map(res => {
          return [
            { id: -1, name: 'Проект' },
            ...mapSelectOptions(res)
          ]
        })
      );
    }
    return this.externals$;
  }
}
