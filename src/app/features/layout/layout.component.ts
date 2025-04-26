import { DialogModule } from '@angular/cdk/dialog';
import { NgFor, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { map, Observable, of, switchMap, tap } from 'rxjs';
import { BaseComponent } from '../../core/components/base.component';
import { ListService } from '../../core/services/list/list.service';
import { CreateListDialogComponent } from '../../shared/components/create-list-dialog/create-list-dialog.component';
import { ListInterface } from '../../shared/interfaces/list.interface';
import { ListStateService } from '../../shared/services/list-state.service';

interface NavItems {
  _id: string
  title: string,
  date: Date | string,
  isMain: boolean
  route: string,
  icon: string | null,
}

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    NgIf,
    NgFor,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    RouterLink,
    DialogModule
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent extends BaseComponent implements OnInit {
  isDesktop = true;
  navItems: NavItems[] = [];

  constructor(
    private dialog: MatDialog,
    private listService: ListService,
    private listStateService: ListStateService,
  ) {
    super()
  }

  ngOnInit(): void {
    if (!this._localRepository.IsInBrowser) return;
    this.isDesktop = window.innerWidth > 768;

    const sub = this.getAllLists().pipe(
      switchMap(() => {
        return this.listStateService.lists$.pipe(
          map(res => res.map(x => {
            return { ...x, route: x.isMain ? '/home' :`list/${x._id}`, icon: x.isMain ? 'home' :null }
          })),
          tap((res) => this.navItems = res),
          tap(() => this.navItems.push({
            _id: '',
            title: 'Completed',
            icon: 'check_circle',
            route: '/completed',
            date: '',
            isMain: false
          })),
        )
      })
    ).subscribe();

    this.subscriptions.push(sub);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (!this._localRepository.IsInBrowser) return;
    this.isDesktop = window.innerWidth > 768;
  }


  handleAddList(): void {
    this.dialog.open(CreateListDialogComponent, {
      data: { isEditMode: false, title: '' }
    }).afterClosed().pipe(
      switchMap((res) => {
        if (!res) return of(null);
        const body: Omit<ListInterface, '_id'> = {
          title: res,
          date: new Date(),
          isMain: false
        }
        return this.listService.insertItemToList(body);
      }),
      tap((res) => {
        if (!res) return;
        this.listStateService.addItem(res)
      })
    ).subscribe();
  }

  private getAllLists(): Observable<ListInterface[]> {
    return this.listService.getAllLists().pipe(
      tap(res => {
        this.listStateService.setLists(res);
      })
    )
  }

}
