import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { Observable, of, switchMap, tap } from 'rxjs';
import { BaseTaskComponent } from '../../core/components/base-task.component';
import { CreateListDialogComponent } from '../../shared/components/create-list-dialog/create-list-dialog.component';
import { TaskDialogComponent } from '../../shared/components/task-dialog/task-dialog.component';
import { TodoContainerComponent } from '../../shared/components/todo-container/todo-container.component';
import { TaskInterface } from './../../shared/interfaces/task.interface';
import { ListInterface } from '../../shared/interfaces/list.interface';
import { ListStateService } from '../../shared/services/list-state.service';

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

  dialog = inject(MatDialog);
  listStateService = inject(ListStateService)

  override getTasks(): Observable<TaskInterface[]> {
    return this.tasksService.getTasksOfList(this.listId);
  }

  handleAddTasks() {
    this.dialog.open(TaskDialogComponent, {
      data: {
        listName: this.listDetail()?.title
      }
    }).afterClosed().pipe(
      switchMap((res) => {
        if (!res) of(null);
        const body: Omit<TaskInterface, 'id'> = {
          title: res.title,
          description: res.description,
          date: res.date,
          done: false,
          list: this.listDetail()!
        }
        return this.tasksService.createTask(body)
      }),
      tap((res) => {
        this.tasks.update((tasks) => [...tasks, res])
      })
    ).subscribe();
  }

  handleChangeName() {
    this.dialog.open(CreateListDialogComponent, {
      data: { isEditMode: true, title: this.listDetail()?.title }
    }).afterClosed().pipe(
      switchMap(res => {
        if (!res) return of(null);
        const body: ListInterface = {
          ...this.listDetail()!,
          title: res,
        }
        this.listDetail.update(l => ({ ...l!, title: res }));
        return this.listService.updateItem(this.listDetail()?._id!, body).pipe(
          tap(() => {
            this.listStateService.updateList(body)
          })
        );
      })
    ).subscribe();
  }

}


