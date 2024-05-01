import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, map, tap } from 'rxjs';


@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrl: './entry-form.component.scss'
})
export class EntryFormComponent {
  form: FormGroup;
  externals$: Observable<any[]>;


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
    this.form.valueChanges.subscribe(res => console.log(res))
    this.form.patchValue({
      title: '* back: sse fix x-accel-buffering: no;',
      description: 'fixed problem with SSE freezing',
      status: 'Done',
      due_date: '2024-04-28',
      externalServiceId: 1,
      externalServiceName: 'doro@github'
    })
  }
  creds: any = ''
  onSubmit() {
    if (this.form.valid) {
      const taskData = {
        title: 'Example Task',
        description: 'This is an example task description.',
        status: 'In Progress',
        due_date: '2022-12-31',
        externalServiceId: 1,
        externalServiceName: 'doro@github'
      };
      const projectName = this.form.value?.external
      console.log('Form Submitted', this.form.value);
      // Add your logic here to save the form data
      this.http.post(`${process.env['SERVER_URL']}/tasks`, taskData).subscribe(res => {
        this.creds = res
      })

    }
  }

  onCancel() {
    this.form.reset();
    // Add your logic here to cancel the form
  }

  private getExternals () {
    return this.http.get<any[]>(`${process.env['SERVER_URL']}/userExternals`).pipe(
      tap(el => console.log(el)),
      // map(el => [])
    )
  }
  back () {

  }
}
