import { Component, inject, OnDestroy } from "@angular/core";
import { catchError, EMPTY, Subscription } from "rxjs";
import { SnackbarService } from "../../shared/services/snackbar.service";


@Component({
    template: ``
})
export abstract class BaseComponent implements OnDestroy {
    subscriptions: Subscription[] = [];
    snackBar: SnackbarService = inject(SnackbarService);

    protected handleError(message: string) {
        return catchError(() => {
            this.snackBar.notification$.next(message);
            return EMPTY;
        });
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}