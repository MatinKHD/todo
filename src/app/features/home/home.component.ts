import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseTaskComponent } from '../../core/components/base-task.component';
import { TodoContainerComponent } from '../../shared/components/todo-container/todo-container.component';
import { TaskInterface } from '../../shared/interfaces/task.interface';

@Component({
  selector: 'app-home',
  imports: [
    TodoContainerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseTaskComponent {

  override getTasks(): Observable<TaskInterface[]> {
    return this.tasksService.getDailyTasks();
  }
}
