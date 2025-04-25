import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseTaskComponent } from '../../core/components/base-task.component';
import { TodoContainerComponent } from '../../shared/components/todo-container/todo-container.component';
import { TaskInterface } from '../../shared/interfaces/task.interface';

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

}
