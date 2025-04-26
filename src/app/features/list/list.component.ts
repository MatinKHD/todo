import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Observable, of, switchMap, tap } from 'rxjs';
import { BaseTaskComponent } from '../../core/components/base-task.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { CreateListDialogComponent } from '../../shared/components/create-list-dialog/create-list-dialog.component';
import { TaskDialogComponent } from '../../shared/components/task-dialog/task-dialog.component';
import { TodoContainerComponent } from '../../shared/components/todo-container/todo-container.component';
import { ListInterface } from '../../shared/interfaces/list.interface';
import { ListStateService } from '../../shared/services/list-state.service';
import { CreateTask, TaskInterface } from './../../shared/interfaces/task.interface';

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

  handleAddTasks() {
    this.dialog.open(TaskDialogComponent).afterClosed().pipe(
      switchMap((res) => {
        if (!res) of(null);
        const body: CreateTask = {
          title: res?.title,
          description: res?.description,
          date: res?.date,
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

  handleRemoveList() {
    this.dialog.open(ConfirmDialogComponent, {
      data: { title: `Confirm Action`, message: `Are you sure you want Remove ${this.listDetail()?.title}` }
    }).afterClosed().pipe(
      switchMap(res =>
        res ? this.removeListItem() : of(null)
      )
    ).subscribe();
  }

  private removeListItem(): Observable<ListInterface> {
    return this.listService.removeItem(this.listDetail()?._id!).pipe(
      tap(() => this.listStateService.removeItem(this.listDetail()!)),
      tap(() => this.router.navigate(['']))
    )
  }

}


