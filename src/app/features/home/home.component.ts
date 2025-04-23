import { Component } from '@angular/core';
import { TodoContainerComponent } from '../../shared/components/todo-container/todo-container.component';

@Component({
  selector: 'app-home',
  imports: [
    TodoContainerComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  title: string = 'My Todo Title My Todo Title My Todo Title My Todo Title';
  date: Date = new Date;
  description: string = 'description for the test of the testing todo';
  isCompleted: boolean = false;


  onDeleteTodo() {
    // do someting
  }

  onEditTodo() {
    // do someting
  }

  onMarkTodoComplete(event: boolean) {
    // do someting
    this.isCompleted = event;
  }

}
