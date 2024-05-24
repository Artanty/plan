import { Component, Injector, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, HttpClientModule],
  template: `
    <div class="mfeWrapper" #viewContainer></div>
    <router-outlet></router-outlet>
  `,
  styles: [],
})
export class AppComponent implements OnInit{
  data: any = null
  @ViewChild('viewContainer', { read: ViewContainerRef }) viewContainer!: ViewContainerRef;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.fetchData();
  }

  async loadAuthComponent(jsonData: string): Promise<void> {

    const m = await loadRemoteModule({
      remoteName: 'plan',
      remoteEntry: process.env['PLAN_URL'],
      exposedModule: './Component'
    });

    this.viewContainer.createComponent(
      m.TaskReadonlyComponent,
      {
        injector: Injector.create({
          providers: [
            { provide: 'TASK_DATA', useValue: jsonData },
            // { provide: PRODUCT_NAME, useValue: 'doro' },
          ],
        }),
      }
    );
  }

  fetchData(): void {
    this.http.get('assets/data.json').subscribe({
      next: (data: any) => {
        this.data = data;
        console.log('Data fetched:', this.data);
        // You can now use this.data in your component
        this.loadAuthComponent(this.data)
      },
      error: (error: any) => {
        console.error('Error fetching data:', error);
        // Handle the error appropriately
      }
    }
    );
  }
}
