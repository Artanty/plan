import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { TBaseOption, prepareStatus4Api, taskStatusOptions as statuses } from '../../constants'
import { IEditTaskApi } from '../../../../../../contracts/editTask';
import { EMPTY, Observable, catchError, finalize, switchMap } from 'rxjs';
import { DrawerService } from '../drawer/drawer.service';
import { HttpClient } from '@angular/common/http';
import { ITaskFormValue, TaskStoreService } from '../../store/task/task-store.service';
import { TaskService } from '../../services/task.service';


export type TEditTaskStatusApi = Pick<IEditTaskApi, 'status'>


@Component({
  selector: 'app-status-select',
  templateUrl: './status-select.component.html',
  styleUrl: './status-select.component.scss'
})
export class StatusSelectComponent implements AfterViewInit {
  @ViewChild('listContainer', { static: true }) listContainer!: ElementRef;
  task: ITaskFormValue | null = null
  taskStatusOptions: TBaseOption[] = statuses.map((el: string, i: number) => ({ id: i + 1, name: el }))
  yShift: number = 0
  Number = Number
  constructor(

    @Inject(HttpClient) private http: HttpClient,
    @Inject(DrawerService) private drawerService: DrawerService,
    @Inject(TaskStoreService) private taskStore: TaskStoreService,
    @Inject(TaskService) private taskService: TaskService,
    @Inject(ChangeDetectorRef) private cdr: ChangeDetectorRef
  ) {}

  ngAfterViewInit(): void {
    this.taskStore.listenTaskToEdit()
    .subscribe(res => {
      this.task = res
      const clickedItemY = this.taskStore.getStatusSelectYPosition()
      setTimeout(() => {
        this.yShift = clickedItemY - this.listContainer.nativeElement.getBoundingClientRect().y
        this.cdr.detectChanges()
      }, 100)
    })
  }

  prepareAndEditTask(selectValue: string | number) {
    this.drawerService.show('loader')
    const taskData: TEditTaskStatusApi = {
      status: prepareStatus4Api(selectValue),
    };
    this.editTaskApi(this.task!.id as number, taskData)
    .pipe(
      switchMap(() => this.taskService.getTasksByService(this.task!.externalServiceId)),
      catchError((err: any) => this.handleError(err)),
      finalize(() => {
        this.back()
        this.drawerService.hide('loader')
      })
    )
    .subscribe()
  }

  public back () {
    this.drawerService.hide('setTaskStatus')
  }

  private editTaskApi(id: number, taskData: TEditTaskStatusApi) {
    return this.http.put(`${process.env['SERVER_URL']}/tasks/${id}`, taskData)
  }
  private handleError (err: string | any): Observable<never> {
    const errorMessage = err instanceof Error ? err.message : String(err)
    console.error(errorMessage)
    return EMPTY
  }

  public deleteTask (taskData: ITaskFormValue) {
    this.drawerService.show('loader')
    this.http.delete(`${process.env['SERVER_URL']}/tasks/${taskData.id}`)
    .pipe(
      switchMap(() => this.taskService.getTasksByService(this.task!.externalServiceId)),
      catchError((err: any) => this.handleError(err)),
      finalize(() => {
        this.back()
        this.drawerService.hide('loader')
      })
    ).subscribe()
  }
}
