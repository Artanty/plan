import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { DrawerService } from '../components/drawer/drawer.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { IGetUserExternalsApi } from '../../../../../contracts/getUserExternals';
import { UserExternalStoreService } from '../store/userExternal/user-external-store.service';
import { UserExternalService } from '../services/user-external.service';

@Component({
  selector: 'app-external-list',
  templateUrl: './external-list.component.html',
  styleUrl: './external-list.component.scss'
})
export class ExternalListComponent {

  externals$: Observable<IGetUserExternalsApi[]>

  constructor(
    @Inject(DrawerService) private drawerService: DrawerService,
    @Inject(UserExternalStoreService) private userExternalStore: UserExternalStoreService,
    @Inject(UserExternalService) private userExternalService: UserExternalService
  ){
    this.externals$ = this.userExternalStore.listenUserExternals()
  }

  removeItem(item: any) {
    this.userExternalService.deleteExternal(item.id).subscribe()
  }

  back () {
    this.drawerService.hide('externalList')
  }

}
