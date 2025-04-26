import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TaskInterface } from '../../interfaces/task.interface';
import { SnackbarService } from '../../services/snackbar.service';

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
  data: { isEditMode: boolean, task: TaskInterface, exisitngDates: string[] } = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<TaskDialogComponent>);
  fb = inject(FormBuilder);
  errorMessageForTitle = signal('');
  snackBar: SnackbarService = inject(SnackbarService);

  titleControl = this.fb.control('', { validators: [Validators.required, Validators.maxLength(100)] });
  descriptionControl = this.fb.control('', { validators: Validators.maxLength(500) });
  dateControl = this.fb.control('', { validators: [Validators.required] });
  timeControl = this.fb.control('', { validators: [Validators.required] });


  ngOnInit(): void {
    if (this.data.isEditMode) this.patchForm();
  }

  private patchForm() {
    this.titleControl.setValue(this.data.task.title);
    this.descriptionControl.setValue(this.data.task.description);
    const date = new Date(this.data.task.date)
    this.dateControl.setValue((this.data.task.date as string));
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    this.timeControl.setValue(`${hours}:${minutes}`);

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
    if (this.dateControl.valid && this.timeControl.valid) {
      const date = new Date(this.dateControl?.value!);
      const [hours, minutes] = this.timeControl?.value!.split(':').map(Number);
      date.setHours(hours, minutes, 0, 0);
      if (this.isDuplicateDate(date)) return this.snackBar.notification$.next('you already have task on this date');
      let body = {
        title: this.titleControl.value,
        description: this.descriptionControl.value,
        date: date,
      }
      if (this.data) body = { ...this.data, ...body };
      this.handleClose(body)
    }
  }

  private isDuplicateDate(date: Date): boolean {
    return this.data.exisitngDates.includes(date.toISOString())
  }
}
