import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, ViewChild, QueryList, ViewChildren, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, EMPTY, Observable, catchError, distinctUntilKeyChanged, finalize, map, switchMap, take, tap } from 'rxjs';
import { DrawerService } from '../components/drawer/drawer.service';
import { ITask } from './../models/task.model'
import { IGetTaskApi } from '../../../../../contracts/getTask'
import { IGetUserExternalsApi } from '../../../../../contracts/getUserExternals'
import { IProductSize, PRODUCT_SIZE } from '../../app.config';
import { UserExternalStoreService } from './../../plan/store/userExternal/user-external-store.service'
import { ITaskFormValue, TaskStoreService } from '../store/task/task-store.service';
import { getStatusId } from '../constants';
import { TaskService } from '../services/task.service';

export type TSelectExternals = Pick<IGetUserExternalsApi, "name" | "id">

@Component({
  selector: 'app-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrls: [
    './entries-list.component.scss',
    './../components/select/select.component.scss'
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EntriesListComponent implements AfterViewInit{
  @ViewChild('listContainer', { static: true }) listContainer!: ElementRef;
  @ViewChild('setTaskStatusDrawerTrigger', { read: ElementRef }) setTaskStatusDrawerTrigger!: ElementRef;

  form: FormGroup;
  externals$: Observable<TSelectExternals[]>;
  tasks$: Observable<IGetTaskApi[]>// = new BehaviorSubject<IGetTaskApi[]>([]);

  constructor(
    private fb: FormBuilder,
    @Inject(HttpClient) private http: HttpClient,
    @Inject(DrawerService) private drawerService: DrawerService,
    @Inject(UserExternalStoreService) private userExternalStore: UserExternalStoreService,
    @Inject(TaskStoreService) private taskStore: TaskStoreService,
    @Inject(TaskService) private taskService: TaskService,
    @Inject(ChangeDetectorRef) public cdr: ChangeDetectorRef,
    @Inject(ElementRef) private elementRef: ElementRef
  ) {
    this.form = this.fb.group({
      externalServiceId: ['', Validators.required],
    });
    this.tasks$ = this.taskStore.listenTasks()
    this.externals$ = this.userExternalStore.listenUserExternals().pipe(
      map(res => {
        return [
          { id: -1, name: 'Проект' },
          ...res.map(el => ({ id: el.id, name: el.name }))
        ]
      })
    )

    this.form.valueChanges.pipe(
      distinctUntilKeyChanged('externalServiceId'),
      tap(res => this.userExternalStore.setUserExternalFilter(+res.externalServiceId)),
      switchMap(res => this.getTasksByService(res.externalServiceId)),
    ).subscribe()

    this.form.patchValue({
      title: '* back: sse fix x-accel-buffering: no;',
      description: 'fixed problem with SSE freezing',
      status: 'Done',
      due_date: '2024-04-28',
      externalServiceId: this.userExternalStore.getUserExternalFilter(),
      externalServiceName: 'doro@github'
    })
  }

  ngAfterViewInit (): void{

  }

  getTasksByService (externalServiceId: number) {
     this.drawerService.showAfterInit('loader')
     return this.taskService.getTasksByService(externalServiceId)
     .pipe(
        catchError((err: any) => this.handleError(err)),
        finalize(() => {
          this.drawerService.hide('loader')
        })
     )
  }

  showCreateTask(){
    this.drawerService.show('createTask')
    this.taskStore.setTaskToEdit(null)
  }

  showCreateExternal() {
    this.drawerService.show('createExternal')
  }

  showStatusSelect(index: number, task: IGetTaskApi) {
    const container = this.listContainer.nativeElement;
    const item = container.children[index];
    const rect = item.getBoundingClientRect();
    const topPosition = rect.top + document.documentElement.scrollTop;
    this.taskStore.setStatusSelectYPosition(topPosition)
    const storageItem = this.prepareForEdit(task)
    this.taskStore.setTaskToEdit(storageItem)
    this.drawerService.show('setTaskStatus')
  }

  prepareForEdit (data: IGetTaskApi) {
    const storageItem: ITaskFormValue = {
      title: data.title,
      description: data.description,
      status: getStatusId(data.status),
      due_date: data.due_date.split('T')[0],
      externalServiceId: data.service_id,
      externalServiceName: data.service_name,
      id: data.id,
      external_task_id: data.external_task_id
    }
    return storageItem
  }

  editTask(data: IGetTaskApi) {
    const storageItem = this.prepareForEdit(data)
    this.taskStore.setTaskToEdit(storageItem)
    this.drawerService.show('createTask')
  }

  showExternalList () {
    this.drawerService.show('externalList')
  }

  private handleError (err: string | any): Observable<never> {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error(errorMessage)
    return EMPTY
  }
}
