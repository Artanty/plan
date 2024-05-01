import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, map, take, tap } from 'rxjs';

@Component({
  selector: 'app-entries-list',
  templateUrl: './entries-list.component.html',
  styleUrl: './entries-list.component.scss'
})
export class EntriesListComponent {
  form: FormGroup;
  externals$: Observable<any[]>;
  tasks$ = new BehaviorSubject<any[]>([]);
  isDrawerOpen = true;

  constructor(
    private fb: FormBuilder,
    @Inject(HttpClient) private http: HttpClient,
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      externalServiceId: ['placeholder', Validators.required],
      externalServiceName: ['']
    });
    this.externals$ = this.getExternals().pipe(
      map(res => {
        return [{ id: 'placeholder', name: 'Проект' }, ...res]
      })
    )

    this.form.valueChanges.subscribe(res => {
      console.log(res)
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
  private getExternals () {
    return this.http.get<any[]>(`${process.env['SERVER_URL']}/userExternals`).pipe(
      tap(el => console.log(el)),
      // map(el => [])
    )
  }

  private getTasksByService (externalServiceId: number) {
    this.http.get<any[]>(`${process.env['SERVER_URL']}/tasks/by-service/${externalServiceId}`)
    .pipe(
      take(1)
    ).subscribe(res => {
      this.tasks$.next(res)
    })
  }
  showCreate(){}

  toggleDrawer() {
    this.isDrawerOpen = !this.isDrawerOpen;
  }
}
