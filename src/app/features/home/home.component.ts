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

}
