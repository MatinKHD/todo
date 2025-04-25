import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-task-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})
export class TaskDialogComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  fb = inject(FormBuilder);
  errorMessageForTitle = signal('');

  titleControl = this.fb.control('', { validators: [Validators.required, Validators.maxLength(100)] });
  descriptionControl = this.fb.control('', { validators: Validators.maxLength(500) });
  dateControl = this.fb.control('')


  ngOnInit(): void {

  }

  updateErrorMessageForTitle() {
    if (!this.titleControl) return;
    if (this.titleControl.hasError('required')) this.errorMessageForTitle.set(`title is required`);
    if (this.titleControl.hasError('maxlength')) this.errorMessageForTitle.set(`title must be 100 char maximum`)
  }

  handleClose(body: any = null) {
    this.dialogRef.close(body)
  }

  handleSubmit() {
    const body = {
      title: this.titleControl.value,
      description: this.descriptionControl.value,
      date: this.dateControl.value,
    }
    this.handleClose(body)
  }
}
