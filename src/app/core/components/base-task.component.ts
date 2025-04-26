import { Component, OnInit, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, of, switchMap, tap } from 'rxjs';
import { BaseComponent } from '../../core/components/base.component';
import { TasksService } from '../../core/services/tasks/tasks.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { TaskDialogComponent } from '../../shared/components/task-dialog/task-dialog.component';
import { ListInterface } from '../../shared/interfaces/list.interface';
import { CreateTask, TaskInterface } from '../../shared/interfaces/task.interface';
import { ListService } from '../services/list/list.service';

@Component({
    template: ``
})
export abstract class BaseTaskComponent extends BaseComponent implements OnInit {
    tasksService = inject(TasksService);
    listService = inject(ListService);
    activatedRoute = inject(ActivatedRoute);
    dialog = inject(MatDialog);
    tasks = signal<TaskInterface[]>([]);
    listId!: string;
    listDetail = signal<ListInterface | undefined>(undefined);

    abstract getTasks(): Observable<TaskInterface[]>;

    ngOnInit(): void {
        const sub = this.activatedRoute.params.pipe(
            tap(params => {
                if (!params['id']) return;
                this.listId = params['id']
            }),
            switchMap(() => this.getListDetail()),
            switchMap(() => this.getTasks()),
            tap((res) => this.tasks.set(res))
        ).subscribe();

        this.subscriptions.push(sub)
    }

    handleAddTasks() {
        this.dialog.open(TaskDialogComponent).afterClosed().pipe(
            switchMap((res) => {
                if (!res) of(null);
                const body: CreateTask = {
                    title: res?.title,
                    description: res?.description,
                    date: res?.date,
                    done: false,
                    list: this.listDetail()!
                }
                return this.tasksService.createTask(body)
            }),
            tap((res) => {
                this.tasks.update((tasks) => [...tasks, res])
            })
        ).subscribe();
    }

    onDeleteTask(id: string): void {
        this.dialog.open(ConfirmDialogComponent, {
            data: { title: 'Confirm Delete', message: 'Are you sure you want to delete this task?' }
        }).afterClosed().pipe(
            switchMap(res => res ? this.deleteTask(id) : of(null))
        ).subscribe();
    }

    onEditTask(task: TaskInterface): void {
        this.dialog.open(TaskDialogComponent, {
            data: { ...task }
        }).afterClosed().pipe(
            switchMap((res) => {
                return res ? this.updateTask(res).pipe(this.handleError(`Something went wrong, Can't edit`)) : of(null)
            })
        ).subscribe();
    }

    onMarkCompletedTask(event: { task: TaskInterface, isComplete: boolean }): void {
        const body: TaskInterface = { ...event.task, done: event.isComplete };
        this.updateTask(body).pipe(
            this.handleError('Something wrong, please try again')
        ).subscribe()
    }

    private deleteTask(id: string): Observable<TaskInterface | unknown> {
        return this.tasksService.deleteTask(id).pipe(
            tap(() => this.tasks.update((tasks) => tasks.filter((task) => task._id !== id))),
            tap(() => this.snackBar.notification$.next('Task deleted successfully')),
            this.handleError(`Something went wrong, Please try again`)
        )
    }

    private updateTask(task: TaskInterface): Observable<TaskInterface> {
        return this.tasksService.updateTask(task._id, task).pipe(
            tap(() => {
                this.tasks.update((tasks) => {
                    const taskIndex = tasks.findIndex((t) => t._id === task._id);
                    if (taskIndex !== -1) tasks[taskIndex] = task;
                    return tasks;
                })
            }),
        )
    }

    private getListDetail(): Observable<ListInterface> {
        return this.listService.getListDetail(this.listId).pipe(
            tap((res) => {
                if (!res) return;
                this.listDetail.set(res)
            })
        )
    }
}