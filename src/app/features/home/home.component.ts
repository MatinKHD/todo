import { Component, inject, OnInit, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseComponent } from '../../core/components/base.component';
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
export class HomeComponent extends BaseComponent implements OnInit {

  tasksService = inject(TasksService);
  dailyTasks = signal<TaskInterface[]>([]);

  ngOnInit(): void {
    const sub = this.getAllDailyTasks().subscribe();
    this.subscriptions.push(sub);
  }

  onDeleteTodo(id: string) {
    this.tasksService.deleteTask(id).pipe(
      tap(() => this.dailyTasks.update(tasks => tasks.filter((task) => task.id !== id)))
    ).subscribe();
  }

  onMarkTodoComplete(task: TaskInterface) {
    this.tasksService.updateTask(task.id, task).pipe(
      tap(() => {
        this.dailyTasks.update((tasks) => {
          const taskIndex = tasks.findIndex(t => t.id === task.id);
          if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], done: task.done }
          }
          return tasks;
        })
      }),
      this.handleError('Something wrong, please try again')
    ).subscribe();
  }

  
  onEditTodo(task: TaskInterface) {
    this.tasksService.updateTask(task.id, task).pipe(
      tap(() => {
        this.dailyTasks.update((tasks) => {
          const taskIndex = tasks.findIndex(t => t.id === task.id);
          tasks[taskIndex] = { ...task };
          this.snackBar.notification$.next('Edited Successfully')
          return tasks;
        })
      }),
      this.handleError(`Can't edit`)
    ).subscribe();
  }

  private getAllDailyTasks(): Observable<TaskInterface[]> {
    return this.tasksService.getDailyTasks().pipe(
      tap(res => this.dailyTasks.set(res))
    )
  }

}
