import { Inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { IGetTaskApi } from '../../../../../../contracts/getTask';
import { HttpClient } from '@angular/common/http';
import { ICreateTaskApi } from '../../../../../../contracts/createTask';
import { IEditTaskApi } from '../../../../../../contracts/editTask';

@Injectable()
export class TaskApiService {

  constructor(
    @Inject(HttpClient) private http: HttpClient,
  ) { }

  public getTasksByService (externalServiceId: number): Observable<IGetTaskApi[]> {
    return this.http.get<IGetTaskApi[]>(`${process.env['SERVER_URL']}/tasks/by-service/${externalServiceId}`)
  }

  public createTask(task: ICreateTaskApi) {
    return this.http.post(`${process.env['SERVER_URL']}/tasks`, task)
  }

  public editTask(id: number, taskData: IEditTaskApi) {
    return this.http.put(`${process.env['SERVER_URL']}/tasks/${id}`, taskData)
  }
}
