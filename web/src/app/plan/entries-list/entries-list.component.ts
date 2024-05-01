import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, map, take, tap } from 'rxjs';
import { DrawerService } from '../components/drawer/drawer.service';
import { ITask } from './../models/task.model'
import { IGetTaskApi } from '../../../../../contracts/getTask'
import { IGetUserExternalsApi } from '../../../../../contracts/getUserExternals'

export type TSelectExternals = Pick<IGetUserExternalsApi, "name" | "id">

@Component({
  selector: 'app-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrls: [
    './entries-list.component.scss',
    './../components/select/select.component.scss'
  ]
})
export class EntriesListComponent {
  form: FormGroup;
  externals$: Observable<TSelectExternals[]>;
  tasks$ = new BehaviorSubject<IGetTaskApi[]>([]);

  constructor(
    private fb: FormBuilder,
    @Inject(HttpClient) private http: HttpClient,
    private drawerService: DrawerService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      externalServiceId: ['', Validators.required],
      externalServiceName: ['']
    });
    this.externals$ = this.getExternals().pipe(
      map(res => {
        return [
          { id: -1, name: 'Проект' },
          ...res.map(el => ({ id: el.id, name: el.name }))
        ]
      })
    )

    this.form.valueChanges.subscribe(res => {
      // console.log(res)
      // res.externalServiceId
      this.getTasksByService(res.externalServiceId)
    })
    this.form.patchValue({
      title: '* back: sse fix x-accel-buffering: no;',
      description: 'fixed problem with SSE freezing',
      status: 'Done',
      due_date: '2024-04-28',
      externalServiceId: 1,
      externalServiceName: 'doro@github'
    })
  }
  private getExternals (): Observable<IGetUserExternalsApi[]> {
    return this.http.get<IGetUserExternalsApi[]>(`${process.env['SERVER_URL']}/userExternals`)
  }

  private getTasksByService (externalServiceId: number): void {
    this.http.get<IGetTaskApi[]>(`${process.env['SERVER_URL']}/tasks/by-service/${externalServiceId}`)
    .pipe(
      take(1)
    ).subscribe(res => {
      this.tasks$.next(res)
    })
  }

  showCreateTask(){
    this.drawerService.show('createTask')
  }

  editItem(task: any | ITask) {
    console.log(task)
  }
}
