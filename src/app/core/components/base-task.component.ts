import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
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
    existingDates = signal<string[]>([]);

    abstract getTasks(): Observable<TaskInterface[]>;

    ngOnInit(): void {
        const sub = this.loadData().subscribe();
        this.subscriptions.push(sub)
    }

    private loadData(): Observable<TaskInterface[]> {
        return this.activatedRoute.params.pipe(
            tap(params => this.setListId(params)),
            switchMap(() => this.getListDetail()),
            switchMap(() => this.getTasks()),
            tap((tasks) => this.updateTaskState(tasks)),
            this.handleError('Fialed to load data')
        )
    }

    private setListId(params: Params): void {
        if (params['id']) this.listId = params['id'];
    }

    private updateTaskState(tasks: TaskInterface[]): void {
        this.tasks.set(tasks);
        this.existingDates.set(tasks.map((t) => t.date.toString()))
    }

    handleAddTasks() {
        this.dialog.open(TaskDialogComponent, {
            data: { isEditMode: false, exisitngDates: this.existingDates() }
        }).afterClosed().pipe(
            switchMap((res) => res ? this.createTask(res) : of(null)),
            tap((task) => task && this.addTaskToState(task)),
            this.handleError('Failed to add task')
        ).subscribe();
    }

    private createTask(data: CreateTask): Observable<TaskInterface> {
        const body: CreateTask = {
            title: data?.title,
            description: data?.description,
            date: data?.date,
            done: false,
            list: this.listDetail()!
        }
        return this.tasksService.createTask(body)
    }

    private addTaskToState(task: TaskInterface): void {
        this.tasks.update((tasks) => [...tasks, task])
    }

    onDeleteTask(id: string): void {
        this.dialog.open(ConfirmDialogComponent, {
            data: { title: 'Confirm Delete', message: 'Are you sure you want to delete this task?' }
        }).afterClosed().pipe(
            switchMap(res => res ? this.deleteTask(id) : of(null)),
            this.handleError('Failed to delete task')
        ).subscribe();
    }

    onEditTask(task: TaskInterface): void {
        this.dialog.open(TaskDialogComponent, {
            data: { task, isEditMode: true, exisitngDates: this.existingDates() }
        }).afterClosed().pipe(
            switchMap((res) => res ? this.updateTask(res) : of(null)),
            this.handleError(`Fialed to edit task`)
        ).subscribe();
    }

    onMarkCompletedTask(event: { task: TaskInterface, isComplete: boolean }): void {
        const body: TaskInterface = { ...event.task, done: event.isComplete };
        this.updateTask(body).pipe(this.handleError('Something wrong, please try again')).subscribe()
    }

    protected deleteTask(id: string): Observable<TaskInterface | unknown> {
        return this.tasksService.deleteTask(id).pipe(
            tap(() => this.removeTaskFromState(id))
        )
    }

    private removeTaskFromState(id: string): void {
        this.tasks.update((tasks) => tasks.filter((task) => task._id !== id))
    }

    protected updateTask(task: TaskInterface): Observable<TaskInterface> {
        return this.tasksService.updateTask(task._id, task).pipe(
            tap(() => this.updateTaskInSignal(task)),
        )
    }

    private updateTaskInSignal(task: TaskInterface): void {
        this.tasks.update((tasks) => {
            const taskIndex = tasks.findIndex((t) => t._id === task._id);
            if (taskIndex !== -1) tasks[taskIndex] = task;

            this.existingDates.set(tasks.map((t) => t.date.toString()))
            return tasks;
        })
    }

    protected getListDetail(): Observable<ListInterface> {
        return this.listService.getListDetail(this.listId).pipe(
            tap((res) => this.listDetail.set(res))
        )
    }
}