import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ListInterface } from '../../shared/interfaces/list.interface';

@Injectable({
  providedIn: 'root'
})
export class ListStateService {
  private listsSubject = new BehaviorSubject<ListInterface[]>([]); // Holds the state of all lists
  lists$ = this.listsSubject.asObservable(); // Observable for components to subscribe to

  // Get the current value of the lists
  getLists(): ListInterface[] {
    return this.listsSubject.getValue();
  }

  // Update the lists
  setLists(lists: ListInterface[]): void {
    this.listsSubject.next(lists);
  }

  // Update a specific list by ID
  updateList(updatedList: ListInterface): void {
    const currentLists = this.getLists();
    const updatedLists = currentLists.map((list) =>
      list._id === updatedList._id ? { ...list, ...updatedList } : list
    );
    this.setLists(updatedLists);
  }

  //Add Items to list
  addItem(item: ListInterface): void {
    let currentLists = this.getLists();
    currentLists = [...currentLists, item];
    this.setLists(currentLists);
  }
}