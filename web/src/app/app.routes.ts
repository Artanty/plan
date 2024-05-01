import { Routes } from '@angular/router';
import { PlanComponent } from './plan/plan.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./plan/plan.module').then((m) => m.PlanModule)
  }
];
