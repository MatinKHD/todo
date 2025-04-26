import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListInterface } from '../../../shared/interfaces/list.interface';

@Injectable({
  providedIn: 'root'
})
export class ListService extends BaseService {

  constructor(http: HttpClient) { 
    super(http)
  }

  getAllLists(): Observable<ListInterface[]> {
    return this.getAll<ListInterface[]>('lists')
  }

  getDailyTaskListDetail(): Observable<ListInterface> {
    return this.getAll<ListInterface>('mainList');
  }

  getListDetail(id: string): Observable<ListInterface> {
    return this.getAll<ListInterface>(`lists/${id}`);
  }

  insertItemToList(body: Omit<ListInterface, '_id'>): Observable<ListInterface> {
    return this.post<ListInterface, Omit<ListInterface, '_id'>>(`lists`, body)
  }

  updateItem(id: string, body: ListInterface): Observable<ListInterface> {
    return this.put<ListInterface, ListInterface>(`lists`, body, id)
  }

  removeItem(id: string): Observable<ListInterface> {
    return this.delete<ListInterface>(`lists`, id);
  }
}
