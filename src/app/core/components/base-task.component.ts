import { Component, OnInit, inject, signal } from '@angular/core';
import { Observable, switchMap, tap } from 'rxjs';
import { BaseComponent } from '../../core/components/base.component';
import { TasksService } from '../../core/services/tasks/tasks.service';
import { TaskInterface } from '../../shared/interfaces/task.interface';
import { ActivatedRoute } from '@angular/router';
import { ListService } from '../services/list/list.service';
import { ListInterface } from '../../shared/interfaces/list.interface';

@Component({
    template: ``
})
export abstract class BaseTaskComponent extends BaseComponent implements OnInit {
    tasksService = inject(TasksService);
    listService = inject(ListService);
    activatedRoute = inject(ActivatedRoute);
    tasks = signal<TaskInterface[]>([]);
    listId!: string;
    listDetail = signal<ListInterface | undefined>(undefined);

    abstract getTasks(): Observable<TaskInterface[]>;

    ngOnInit(): void {
        this.activatedRoute.params.pipe(
            tap(params => {
                if (!params['id']) return;
                this.listId = params['id']
            }),
            switchMap(() => this.getListDetail()),
            switchMap(() => this.getTasks()),
            tap((res) => this.tasks.set(res))
        ).subscribe();
    }

    private getListDetail(): Observable<ListInterface> {
        return this.listService.getListDetail(this.listId).pipe(
            tap((res) => {
                if (!res) return;
                this.listDetail.set(res)
            })
        )
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