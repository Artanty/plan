import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, map, switchMap, shareReplay, concatMap, EMPTY, of, catchError, finalize } from 'rxjs';
import { ICreateTaskApi } from '../../../../../contracts/createTask';
import { IGetUserExternalsApi } from '../../../../../contracts/getUserExternals';
import { TSelectExternals } from '../entries-list/entries-list.component';
import { DrawerService } from '../components/drawer/drawer.service';
import { validateExternalServiceId }  from '../validators/externalServiceId'
import { UserExternalService } from '../services/user-external.service';
import { UserExternalApiService } from '../api/userExternal/user-external-api.service';
export interface ICreateExternalApi {
  name: string
}
@Component({
  selector: 'app-external-form',
  templateUrl: './external-form.component.html',
  styleUrl: './external-form.component.scss'
})
export class ExternalFormComponent {
  form: FormGroup;
  errorMessage: string = ''
  initialFormResult = {name: ''}
  Number = Number

  constructor(
    private fb: FormBuilder,
    @Inject(HttpClient) private http: HttpClient,
    private drawerService: DrawerService,
    private cdr: ChangeDetectorRef,
    @Inject(UserExternalService) private UserExternalServ: UserExternalService
  ) {


    this.form = this.fb.group({
      name: ['', Validators.required]
    });

    this.form.valueChanges.subscribe(res => {
      this.resetValidation()
    })

    this.form.patchValue({
      name: new Date().toString().toLowerCase().slice(0,3) + '@test'
    })
  }

  onSubmit() {
    this.drawerService.show('loader')
    this.errorMessage = ''
    if (this.form.valid) {
      this.UserExternalServ.getUserExternals().pipe(
        switchMap((ext: IGetUserExternalsApi[]) => {
          this.validateName(this.form.value.name, ext)
          return this.prepareAndCreateTask()
        }),
        switchMap(() => this.UserExternalServ.getUserExternals()),
        catchError((err: any) => this.handleError(err)),
        finalize(() => this.drawerService.hide('loader'))
      ).subscribe(() => {
        this.back()
      })
    } else {
      this.form.markAllAsTouched()
    }
  }

  private validateName (name: string, ext: IGetUserExternalsApi[]): void | Error {
    const isNameUsed = ext.map(el => el.name).includes(name)
    if (isNameUsed) throw new Error('Проект с таким названием уже существует')
    validateExternalServiceId(name)
  }

  private handleError (err: string | any): Observable<never> {
    this.errorMessage = err instanceof Error ? err.message : String(err)
    return EMPTY
  }

  onCancel() {
    this.onReset()
    this.back()
  }

  onReset () {
    this.form.reset();
    this.cdr.detectChanges()
  }

  back () {
    this.drawerService.hide('createExternal')
  }

  prepareAndCreateTask (): Observable<any> {
    const createExternalData: ICreateExternalApi = {
      name: this.form.value.name,
    };
    return this.createTaskApi(createExternalData)
  }

  get isClearBtnVisible (): boolean {
    return JSON.stringify(this.initialFormResult) !== JSON.stringify(this.form.value)

  }

  createTaskApi(external: ICreateExternalApi) {
    // const taskData = {
    //   title: 'Example Task',
    //   description: 'This is an example task description.',
    //   status: 'In Progress',
    //   due_date: '2022-12-31',
    //   externalServiceId: 1,
    //   externalServiceName: 'doro@github'
    // };

    return this.http.post(`${process.env['SERVER_URL']}/userExternals/createAndLink`, external)
  }

  private resetValidation() {
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
