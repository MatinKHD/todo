import { Component, OnInit, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { BaseComponent } from '../../core/components/base.component';
import { TasksService } from '../../core/services/tasks/tasks.service';
import { TaskInterface } from '../../shared/interfaces/task.interface';

@Component({
    template: ``
})
export abstract class BaseTaskComponent extends BaseComponent implements OnInit {
    tasksService = inject(TasksService);
    tasks = signal<TaskInterface[]>([]);

    abstract getTasks(): Observable<TaskInterface[]>;

    ngOnInit(): void {
        const sub = this.getTasks().pipe(
            tap((res) => this.tasks.set(res))
        ).subscribe();
        this.subscriptions.push(sub);
    }

    onDeleteTask(id: string): void {
        this.tasksService.deleteTask(id).pipe(
            tap(() => this.tasks.update((tasks) => tasks.filter((task) => task.id !== id))),
            this.handleError(`Something went wrong, Please try again`)
        ).subscribe();
    }

    onEditTask(task: TaskInterface): void {
        this.tasksService.updateTask(task.id, task).pipe(
            tap(() => {
                this.tasks.update((tasks) => {
                    const taskIndex = tasks.findIndex((t) => t.id === task.id);
                    if (taskIndex !== -1) {
                        tasks[taskIndex] = { ...tasks[taskIndex], ...task };
                    }
                    return tasks;
                });
            }),
            this.handleError(`Something went wrong, Can't edit`)
        ).subscribe();
    }

    onMarkCompletedTask(task: TaskInterface): void {
        this.tasksService.updateTask(task.id, task).pipe(
            tap(() => {
                this.tasks.update((tasks) => {
                    const taskIndex = tasks.findIndex((t) => t.id === task.id);
                    if (taskIndex !== -1) tasks[taskIndex] = { ...task };
                    return tasks;
                })

            }),
            this.handleError('Something wrong, please try again')
        ).subscribe();
    }


}