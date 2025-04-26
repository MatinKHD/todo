import { DialogRef } from '@angular/cdk/dialog';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-create-list-dialog',
  imports: [
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './create-list-dialog.component.html',
  styleUrl: './create-list-dialog.component.scss'
})
export class CreateListDialogComponent {

  title!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {isEditMode: boolean, title: string},
    private dialogRef: MatDialogRef<CreateListDialogComponent>,
  ) {
    this.title = data.isEditMode ? data.title : '' ;
  }
  
  handleClose(data: string | null = null) {
    this.dialogRef.close(data);
  }

  handleSubmit() {
    this.handleClose(this.title);
  }

}
