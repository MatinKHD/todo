import { DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { TaskInterface } from '../../interfaces/task.interface';
import { DateColorPipe } from '../../pipes/date-color.pipe';

@Component({
  selector: 'app-todo',
  imports: [
    MatExpansionModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    DatePipe,
    MatTooltipModule,
    NgClass,
    NgTemplateOutlet,
    TruncatePipe,
    DateColorPipe
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent implements OnInit {

  todo = input<TaskInterface>();

  isCompletedControl: FormControl = new FormControl(false);

  isExpanded = false;

  @Output() onDelete = new EventEmitter<string>();
  @Output() onEdit = new EventEmitter<TaskInterface>();
  @Output() onMarkComplete = new EventEmitter<{ task: TaskInterface, isComplete: boolean }>();

  ngOnInit(): void {
    this.isCompletedControl.setValue(this.todo()?.done)
  }

  handleOnDelete(): void {
    this.onDelete.emit(this.todo()?._id);
  }

  handleOnEdit(): void {
    this.onEdit.emit(this.todo());
  }

  handleOnMarkComplete(): void {
    this.onMarkComplete.emit({ task: this.todo()!, isComplete: this.isCompletedControl.value });
  }
}
