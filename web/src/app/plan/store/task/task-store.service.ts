import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { IGetTaskApi } from '../../../../../../contracts/getTask';

export interface ITaskFormValue {
  title: string
  description: string
  status: number
  due_date: string
  externalServiceId: number
  externalServiceName: string
  id?: number
  external_task_id?: string
}

@Injectable({
  providedIn: 'root'
})
export class TaskStoreService {

  private taskToEdit$ = new BehaviorSubject<ITaskFormValue | null>(null)
  private tasks$ = new BehaviorSubject<IGetTaskApi[]>([])
  private statusSelectYPosition: number = 0

  constructor() { }

  public getTaskToEdit (): ITaskFormValue | null {
    return this.taskToEdit$.getValue()
  }

  public setTaskToEdit (data: ITaskFormValue | null): void {
    this.taskToEdit$.next(data)
  }

  public listenTaskToEdit (): Observable<ITaskFormValue | null> {
    return this.taskToEdit$.asObservable()
  }

  public getTasks (): IGetTaskApi[] {
    return this.tasks$.getValue()
  }

  public setTasks (data: IGetTaskApi[]): void {
    this.tasks$.next(data)
  }

  public listenTasks (): Observable<IGetTaskApi[]> {
    return this.tasks$.asObservable()
  }

  public setStatusSelectYPosition (data: number): void {
    this.statusSelectYPosition = Math.round(data)
  }

  public getStatusSelectYPosition (): number {
    return this.statusSelectYPosition
  }
}
