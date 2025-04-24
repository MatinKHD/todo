import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {

  notification$: Subject<string> = new Subject();

  constructor() { }

}
