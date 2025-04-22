import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() title: string = 'title';
  @Input() date: Date = new Date();
  @Input() description: string = 'description descriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescriptiondescription';
  @Input() isCompleted: boolean = false;

  @Output() delete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() markComplete = new EventEmitter<boolean>();

  onDeleteTodo() {
    this.delete.emit();
  }

  onEditTodo() {
    this.edit.emit();
  }

  onMarkTodoComplete(event: any) {
    this.isCompleted = event.checked;
    this.markComplete.emit(this.isCompleted);
  }

}
