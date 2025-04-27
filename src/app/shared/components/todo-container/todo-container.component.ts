import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';
import { TaskInterface } from '../../interfaces/task.interface';
import { TodoComponent } from '../todo/todo.component';

@Component({
  selector: 'app-todo-container',
  imports: [
    TodoComponent,
    NgFor
  ],
  templateUrl: './todo-container.component.html',
  styleUrl: './todo-container.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TodoContainerComponent {

  tasks = input<TaskInterface[]>([]);
  isMain = input<boolean>(false);

  @Output() onDelete = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<TaskInterface>();
  @Output() onMarkComplete = new EventEmitter<{ task: TaskInterface, isComplete: boolean }>();
  @Output() onMoveTodo = new EventEmitter<TaskInterface>();

  handleOnDeleteTodo(id: string) {
    this.onDelete.emit(id);
  }

  handleOnEditTodo(task: TaskInterface) {
    this.onEdit.emit(task);
  }

  handleOnMarkTodoComplete(event: { task: TaskInterface, isComplete: boolean }) {
    this.onMarkComplete.emit(event);
  }

  handleOnMoveTodo(event: TaskInterface) {
    this.onMoveTodo.emit(event)
  }

}
