import { Component, EventEmitter, input, Input, InputSignal, Output } from '@angular/core';
import { TodoComponent } from '../todo/todo.component';
import { TaskInterface } from '../../interfaces/task.interface';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-todo-container',
  imports: [
    TodoComponent,
    NgFor
  ],
  templateUrl: './todo-container.component.html',
  styleUrl: './todo-container.component.scss'
})
export class TodoContainerComponent {

  tasks = input<TaskInterface[]>([]);

  @Output() onDelete = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onMarkComplete = new EventEmitter<boolean>();

  handleOnDeleteTodo() {
    this.onDelete.emit();
  }

  handleOnEditTodo() {
    this.onEdit.emit();
  }

  handleOnMarkTodoComplete(event: any) {
    this.onMarkComplete.emit(event.checked);
  }

}
