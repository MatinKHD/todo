import { Component, OnInit, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { TodoContainerComponent } from '../../shared/components/todo-container/todo-container.component';
import { TaskInterface } from '../../shared/interfaces/task.interface';
import { TasksService } from './../../core/services/tasks/tasks.service';

@Component({
  selector: 'app-home',
  imports: [
    TodoContainerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {

  tasksService = inject(TasksService);
  dailyTasks = signal<TaskInterface[]>([]);

  ngOnInit(): void {
    this.getAllDailyTasks().subscribe();
  }

  onDeleteTodo(event: TaskInterface, index: number) {
    this.tasksService.deleteTask(event.id).pipe(
      tap(() => this.dailyTasks.update(tasks => tasks.filter((_, i) => i !== index)))
    ).subscribe();
  }
  
  private getAllDailyTasks(): Observable<TaskInterface[]> {
    return this.tasksService.getDailyTasks().pipe(
      tap(res => this.dailyTasks.set(res))
    )
  }

}
