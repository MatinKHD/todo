import { Component, EventEmitter, input, Input, InputSignal, Output } from '@angular/core';
import { TodoComponent } from '../todo/todo.component';

@Component({
  selector: 'app-todo-container',
  imports: [
    TodoComponent
  ],
  templateUrl: './todo-container.component.html',
  styleUrl: './todo-container.component.scss'
})
export class TodoContainerComponent {
  title = input<string>('');
  date = input<Date>(new Date);
  description = input<string>('');
  isCompleted = input<boolean>(false);

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
