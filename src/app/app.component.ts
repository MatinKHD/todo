import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from './shared/services/snackbar.service';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet></router-outlet>',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'todo-app';

  private snackbarService: SnackbarService = inject(SnackbarService);
  private snackbar: MatSnackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.notificationListener().subscribe();
  }

  notificationListener() {
    return this.snackbarService.notification$.pipe(
      tap(m => this.openSnackbar(m))
    );
  }

  openSnackbar(message: string) {
    this.snackbar.open(message, undefined, { duration: 2000 });
  }
}
