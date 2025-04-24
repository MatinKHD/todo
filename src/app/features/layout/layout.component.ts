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
import { LocalRepository } from '../../core/local-store/local-repository';
import { ListService } from '../../core/services/list/list.service';
import { CreateListDialogComponent } from '../../shared/components/create-list-dialog/create-list-dialog.component';
import { ListInterface } from '../../shared/interfaces/list.interface';

interface NavItems {
  name: string,
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
export class LayoutComponent implements OnInit {
  isDesktop = true;
  navItems: NavItems[] = [
    {
      name: 'Daily',
      icon: 'calendar_today',
      route: '/home',
    },
    {
      name: 'Completed',
      icon: 'check_circle',
      route: '/completed',
    }
  ];

  constructor(
    private _localRepository: LocalRepository,
    private dialog: MatDialog,
    private listService: ListService
  ) {

  }

  ngOnInit(): void {
    if (!this._localRepository.IsInBrowser) return;
    this.isDesktop = window.innerWidth > 768;

    this.getListItems().subscribe();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (!this._localRepository.IsInBrowser) return;
    this.isDesktop = window.innerWidth > 768;
  }


  handleAddList(): void {
    this.dialog.open(CreateListDialogComponent).afterClosed().pipe(
      switchMap((res) => {
        if (!res) return of(null);
        return this.listService.insertItemToList(res)
      })
    ).subscribe();
  }

  private getListItems(): Observable<ListInterface[]> {
    return this.listService.getAllLists().pipe(
      tap(res => {
        const navItems = res.map(x => ({name: x.title, route: `list/${x.id}`, icon: null}))
        this.navItems = [...this.navItems, ...navItems]
      })
    )
  }

}
