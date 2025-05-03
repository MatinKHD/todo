import { Component, OnInit } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { BaseTaskComponent } from '../../core/components/base-task.component';
import { TodoContainerComponent } from '../../shared/components/todo-container/todo-container.component';
import { TaskInterface } from '../../shared/interfaces/task.interface';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  imports: [
    TodoContainerComponent,
    MatIconModule, 
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent extends BaseTaskComponent implements OnInit {

  override ngOnInit(): void {
    const sub = this.getMainList().pipe(
      switchMap(() => this.getTasks()),
      tap((res) => this.tasks.set(res)),
      tap(() => this.existingDates.set(this.tasks().map((t) => t.date.toString()))),
    ).subscribe();

    this.subscriptions.push(sub);
  }
  
  private getMainList(): Observable<any> {
    return this.listService.getDailyTaskListDetail().pipe(
      tap(list => this.listDetail.set(list))
    )
  }

  override getTasks(): Observable<TaskInterface[]> {
    return this.tasksService.getTasksOfList(this.listDetail()?._id!);
  }
}
