import { Component, inject, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { SnackbarService } from "../../shared/services/snackbar.service";


@Component({
    template: ``
})
export abstract class BaseComponent implements OnDestroy {
    subscriptions: Subscription[] = [];
    snackBar: SnackbarService = inject(SnackbarService);

    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
}