import { Component, inject, OnDestroy } from "@angular/core";
import { catchError, EMPTY, Observable, Subscription } from "rxjs";
import { SnackbarService } from "../../shared/services/snackbar.service";
import { LocalRepository } from "../local-store/local-repository";


@Component({
    template: ``
})
export abstract class BaseComponent implements OnDestroy {
    subscriptions: Subscription[] = [];
    snackBar: SnackbarService = inject(SnackbarService);
    _localRepository: LocalRepository = inject(LocalRepository);

    protected handleError<T>(message: string): (source: Observable<T>) => Observable<T> {
        return catchError(() => {
            this.snackBar.notification$.next(message);
            return EMPTY;
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}