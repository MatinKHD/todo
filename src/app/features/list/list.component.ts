import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { BaseTaskComponent } from '../../core/components/base-task.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { CreateListDialogComponent } from '../../shared/components/create-list-dialog/create-list-dialog.component';
import { TodoContainerComponent } from '../../shared/components/todo-container/todo-container.component';
import { ListInterface } from '../../shared/interfaces/list.interface';
import { ListStateService } from '../../shared/services/list-state.service';
import { TaskInterface } from './../../shared/interfaces/task.interface';

@Component({
  selector: 'app-list',
  imports: [
    TodoContainerComponent,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent extends BaseTaskComponent {

  listStateService = inject(ListStateService);
  router: Router = inject(Router)

  override getTasks(): Observable<TaskInterface[]> {
    return this.tasksService.getTasksOfList(this.listId);
  }

  handleChangeName() {
    this.dialog.open(CreateListDialogComponent, {
      data: { isEditMode: true, title: this.listDetail()?.title }
    }).afterClosed().pipe(
      switchMap(res => this.updateListName(res)),
      this.handleError('Failed to update list name')
    ).subscribe();
  }

  handleRemoveList() {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: `Confirm Action`, message: `Are you sure you want Remove ${this.listDetail()?.title}` }
    }).afterClosed().pipe(
      switchMap(res => res ? this.removeListItem() : of(null)),
      this.handleError('Failed to remove list')
    ).subscribe();
  }

  onMoveTask(event: TaskInterface) {
    this.getDailyTaskDetails().pipe(
      switchMap((dailyTaskDetail) => this.checkForDuplicateDate(dailyTaskDetail._id, event)),
      switchMap(res => res.isDuplicate ? this.handleDuplicateTasks() : this.moveTaskToDailyList(res.dailyTaskDetail, event)),
      this.handleError('Failed to move task to daily list')
    ).subscribe();
  }

  private updateListName(newTitle: string | null): Observable<ListInterface | null> {
    if (!newTitle) return of(null);
    const updatedList: ListInterface = { ...this.listDetail()!, title: newTitle };
    return this.listService.updateItem(this.listDetail()?._id!, updatedList).pipe(
      tap(() => {
        this.listDetail.update((list) => ({ ...list!, title: newTitle }));
        this.listStateService.updateList(updatedList);
      }),
      tap(() => this.snackBar.notification$.next('List name updated successfully'))
    );
  }

  private getDailyTaskDetails(): Observable<ListInterface> {
    return this.listService.getDailyTaskListDetail();
  }

  private checkForDuplicateDate(dailyTaskId: string, task: TaskInterface): Observable<{ isDuplicate: boolean; dailyTaskDetail: ListInterface }> {
    return this.tasksService.getTasksOfList(dailyTaskId).pipe(
      map((tasks) => {
        const taskDates = new Set(tasks.map((t) => t.date));
        const isDuplicate = taskDates.has(task.date);
        return { isDuplicate, dailyTaskDetail: { _id: dailyTaskId } as ListInterface };
      })
    );
  }

  private handleDuplicateTasks() {
    this.snackBar.notification$.next('Operation failed, there is a task with this date & time in the daily list');
    return of(null);
  }

  private moveTaskToDailyList(dailyTaskDetail: ListInterface, task: TaskInterface): Observable<TaskInterface> {
    const updatedTask: TaskInterface = { ...task, list: dailyTaskDetail };
    return this.updateTask(updatedTask).pipe(
      tap(() => {
        this.tasks.update((tasks) => tasks.filter((t) => t._id !== task._id));
        this.existingDates.update(dates => dates.filter(d => d !== task.date))
        this.snackBar.notification$.next('Task moved to daily list successfully');
      })
    );
  }

  private removeListItem(): Observable<ListInterface> {
    return this.listService.removeItem(this.listDetail()?._id!).pipe(
      tap(() => {
        this.listStateService.removeItem(this.listDetail()!)
        this.router.navigate([''])
        this.snackBar.notification$.next('List removed successfully');
      })
    )
  }

}


