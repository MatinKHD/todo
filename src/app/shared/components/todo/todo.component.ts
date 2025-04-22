import { DatePipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
    FormsModule,
    DatePipe,
    MatTooltipModule,
    NgClass,
    NgTemplateOutlet
  ],
  templateUrl: './todo.component.html',
  styleUrl: './todo.component.scss'
})
export class TodoComponent {

  @Input() title!: string;
  @Input() date!: Date;
  @Input() description!: string;
  @Input() isCompleted!: boolean;

  isExpanded = false;

  @Output() delete = new EventEmitter<void>();
  @Output() edit = new EventEmitter<void>();
  @Output() markComplete = new EventEmitter<boolean>();

  onDelete(): void {
    this.delete.emit();
  }

  onEdit(): void {
    this.edit.emit();
  }

  onMarkComplete(): void {
    this.markComplete.emit(this.isCompleted);
  }
}
