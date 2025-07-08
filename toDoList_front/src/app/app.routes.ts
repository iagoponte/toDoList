import { RouterModule, Routes } from '@angular/router';
import { TaskListComponent } from './pages/task-list/task-list.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
  { path: '', component: TaskListComponent },
  { path: '**', redirectTo: '' } // fallback
];
