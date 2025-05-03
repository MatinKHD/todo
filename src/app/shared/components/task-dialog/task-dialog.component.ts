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
import { noWhitespaceValidator } from '../../utilites/noWhiteSpace.validator';

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
  snackBar: SnackbarService = inject(SnackbarService);

  errorMessageForTitle = signal('');
  titleControl = this.fb.control('', { validators: [Validators.required, Validators.maxLength(100), noWhitespaceValidator()] });
  descriptionControl = this.fb.control('', { validators: [Validators.maxLength(500), noWhitespaceValidator()] });
  dateControl = this.fb.control('', { validators: [Validators.required] });
  timeControl = this.fb.control('', { validators: [Validators.required] });


  ngOnInit(): void {
    if (this.data.isEditMode) this.patchForm();
  }

  private patchForm(): void {
    const { title, description, date } = this.data.task;
    this.titleControl.setValue(title);
    this.descriptionControl.setValue(description);

    const parsedDate = new Date(date);
    this.dateControl.setValue(parsedDate.toISOString())
    this.timeControl.setValue(this.formatTime(parsedDate));
  }

  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  updateErrorMessageForTitle() {
    if (!this.titleControl) return;
    if (this.titleControl.hasError('required')) this.errorMessageForTitle.set(`title is required`);
    if (this.titleControl.hasError('maxlength')) this.errorMessageForTitle.set(`title must be 100 char maximum`)
    else this.errorMessageForTitle.set('');
  }

  handleClose(body: any = null) {
    this.dialogRef.close(body)
  }

  handleSubmit() {
    if (this.formIsValid()) {
      const date = this.combineDateAndTime();
      if (this.isDuplicateDate(date)) return this.snackBar.notification$.next('you already have task on this date');
      let body = {
        title: this.titleControl.value,
        description: this.descriptionControl.value,
        date: date.toISOString(),
      }
      if (this.data.isEditMode) body = { ...this.data.task, ...body };
      this.handleClose(body)
    }
  }

  private formIsValid(): boolean {
    if (this.titleControl.invalid) {
      this.updateErrorMessageForTitle();
      return false;
    }
    if (this.dateControl.invalid || this.timeControl.invalid) {
      this.snackBar.notification$.next('Please provide a valid date and time');
      return false;
    }
    return true;
  }

  private combineDateAndTime(): Date {
    const date = new Date(this.dateControl?.value!);
    const [hours, minutes] = this.timeControl?.value!.split(':').map(Number);
    date.setHours(hours, minutes, 0, 0);
    return date;
  }

  private isDuplicateDate(date: Date): boolean {
    if (this.data.isEditMode && this.data.task.date === date.toISOString()) return false;
    return this.data.exisitngDates.includes(date.toISOString())
  }
}
