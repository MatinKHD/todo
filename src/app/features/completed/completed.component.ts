import { Component } from '@angular/core';
import { Observable, of, switchMap } from 'rxjs';
import { BaseTaskComponent } from '../../core/components/base-task.component';
import { TodoContainerComponent } from '../../shared/components/todo-container/todo-container.component';
import { TaskInterface } from '../../shared/interfaces/task.interface';
import { TaskDialogComponent } from '../../shared/components/task-dialog/task-dialog.component';

@Component({
  selector: 'app-completed',
  imports: [
    TodoContainerComponent
  ],
  templateUrl: './completed.component.html',
  styleUrl: './completed.component.scss'
})
export class CompletedComponent extends BaseTaskComponent {

  override getTasks(): Observable<TaskInterface[]> {
    return this.tasksService.getCompletedTasks();
  }
  // override this method for letting user to edit the task without considering duplicate time 
  override onEditTask(task: TaskInterface): void {
    this.dialog.open(TaskDialogComponent, {
      data: {
        task,
        isEditMode: true,
        exisitngDates: []
      }
    }).afterClosed().pipe(
      switchMap((res) => {
        console.log(res);
        
        return res ? this.updateTask(res).pipe(this.handleError(`Something went wrong, Can't edit`)) : of(null);
      })
    ).subscribe();
  }

}
