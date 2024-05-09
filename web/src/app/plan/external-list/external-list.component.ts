import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { DrawerService } from '../components/drawer/drawer.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IGetUserExternalsApi } from '../../../../../contracts/getUserExternals';

@Component({
  selector: 'app-external-list',
  templateUrl: './external-list.component.html',
  styleUrl: './external-list.component.scss'
})
export class ExternalListComponent {
  externals$ = new BehaviorSubject<IGetUserExternalsApi[]>([]);
  constructor(
    @Inject(HttpClient) private http: HttpClient,
    private drawerService: DrawerService,
    private cdr: ChangeDetectorRef
  ){
    // this.getExternalsApi()
  }
  removeItem(item: any) {
    this.deleteExternalApi(item.id)
  }

  back () {
    this.drawerService.hide('externalList')
  }

  private getExternalsApi (): void {
    this.http.get<IGetUserExternalsApi[]>(`${process.env['SERVER_URL']}/userExternals`)
    .subscribe(res => {
      this.externals$.next(res)
    })
  }

  private deleteExternalApi (id: number): void {
    this.http.delete<{message: string}>(`${process.env['SERVER_URL']}/userExternals/${id}`)
    .subscribe({
      next: (res: any) => {
        this.getExternalsApi()
      }
    })
  }
}
