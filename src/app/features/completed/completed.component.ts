import { Component, inject, OnInit, signal } from '@angular/core';
import { BaseComponent } from '../../core/components/base.component';
import { TasksService } from '../../core/services/tasks/tasks.service';
import { TaskInterface } from '../../shared/interfaces/task.interface';
import { tap, Observable } from 'rxjs';
import { TodoContainerComponent } from '../../shared/components/todo-container/todo-container.component';
import { BaseTaskComponent } from '../../core/components/base-task.component';

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
