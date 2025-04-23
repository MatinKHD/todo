import { DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, EventEmitter, input, InputSignal, OnInit, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

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
    NgTemplateOutlet
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent implements OnInit {

  title = input<string>('');
  date = input<Date>(new Date);
  description = input<string>('');
  isCompleted = input<boolean>(false);

  isCompletedControl: FormControl = new FormControl(false);

  isExpanded = false;

  @Output() onDelete = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<void>();
  @Output() onMarkComplete = new EventEmitter<boolean>();

  ngOnInit(): void {
    this.isCompletedControl.setValue(this.isCompleted)
  }

  handleOnDelete(): void {
    this.onDelete.emit();
  }

  handleOnEdit(): void {
    this.onEdit.emit();
  }

  handleOnMarkComplete(): void {
    this.onMarkComplete.emit(this.isCompleted());
  }
}
