import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task } from '../interface/task';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  constructor(private httpClient: HttpClient) {}
  private apiUrl = 'http://localhost:4000/api/tasks';

  getTasks(): Observable<Task[]> {
    return this.httpClient.get<Task[]>(this.apiUrl);
  }

  createTask(task: Partial<Task>): Observable<Task> {
    return this.httpClient.post<Task>(this.apiUrl, task);
  }

  updateTask(id: number, task: Partial<Task>): Observable<Task> {
    return this.httpClient.put<Task>(`${this.apiUrl}/${id}`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.httpClient.delete(this.apiUrl);
  }

  exportCSV(): Observable<Blob> {
    return this.httpClient.get(`${this.apiUrl}/export`, { responseType: 'blob' });
  }
}
