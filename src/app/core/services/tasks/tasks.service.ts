import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TaskInterface } from '../../../shared/interfaces/task.interface';

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

  getDailyTasks(): Observable<TaskInterface[]> {
    return this.getAll<TaskInterface[]>('mainList');
  }

  getTasksOfList(listId: string): Observable<TaskInterface[]> {
    return this.getAll<TaskInterface[]>(`tasks/query/${listId}`)
  }

  findTaskByListId(listId: string): Observable<TaskInterface> {
    return this.getByDetail<TaskInterface>('tasks/query/', listId);
  }

  getTaskById(id: string): Observable<Omit<TaskInterface, 'id'>> {
    return this.getByDetail<Omit<TaskInterface, 'id'>>('tasks/', id);
  }

  updateTask(id:string, body: Omit<TaskInterface, 'id'>): Observable<TaskInterface> {
    return this.put<TaskInterface, Omit<TaskInterface, 'id'>>('tasks/', body, id);
  }

  createTask( body: Omit<TaskInterface, 'id'>): Observable<TaskInterface> {
    return this.post<TaskInterface, Omit<TaskInterface, 'id'>>('tasks/', body);
  }

  deleteTask(id: string): Observable<TaskInterface> {
    return this.delete<TaskInterface>('tasks/', id);
  }
}
