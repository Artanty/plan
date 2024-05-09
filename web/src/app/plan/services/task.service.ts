import { Inject, Injectable } from '@angular/core';
import { TaskApiService } from '../api/task/task-api.service';
import { TaskStoreService } from '../store/task/task-store.service';
import { IGetTaskApi } from '../../../../../contracts/getTask';
import { Observable, delay, tap } from 'rxjs';
import { DrawerService } from '../components/drawer/drawer.service';

@Injectable()
export class TaskService {

  constructor(
    @Inject(TaskApiService) private api: TaskApiService,
    @Inject(TaskStoreService) private store: TaskStoreService,
  ) { }

  public getTasksByService (externalServiceId: number): Observable<IGetTaskApi[]> {
    return this.api.getTasksByService(externalServiceId)
    .pipe(
      tap((res: IGetTaskApi[]) => this.store.setTasks(res)),
    )
  }
}
