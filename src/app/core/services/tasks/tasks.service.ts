import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateTask, TaskInterface } from '../../../shared/interfaces/task.interface';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class TasksService extends BaseService {

  constructor(http: HttpClient) { 
    super(http)
  }

  getAllTasks(): Observable<TaskInterface[]> {
    return this.getAll<TaskInterface[]>('tasks');
  }

  getCompletedTasks(): Observable<TaskInterface[]> {
     return this.getAll<TaskInterface[]>('compeleted');
  }

  getTasksOfList(listId: string): Observable<TaskInterface[]> {
    return this.getAll<TaskInterface[]>(`tasks/query/${listId}`)
  }

  getTaskById(id: string): Observable<CreateTask> {
    return this.getByDetail<CreateTask>('tasks', id);
  }

  updateTask(id:string, body: TaskInterface): Observable<TaskInterface> {
    return this.put<TaskInterface, TaskInterface>('tasks', body, id);
  }

  createTask( body: CreateTask): Observable<TaskInterface> {
    return this.post<TaskInterface, CreateTask>('tasks', body);
  }

  deleteTask(id: string): Observable<TaskInterface> {
    return this.delete<TaskInterface>('tasks', id);
  }
}
