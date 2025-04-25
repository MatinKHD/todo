import { Component, inject, OnInit, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseComponent } from '../../core/components/base.component';
import { TodoContainerComponent } from '../../shared/components/todo-container/todo-container.component';
import { TaskInterface } from '../../shared/interfaces/task.interface';
import { TasksService } from './../../core/services/tasks/tasks.service';
import { BaseTaskComponent } from '../../core/components/base-task.component';

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
