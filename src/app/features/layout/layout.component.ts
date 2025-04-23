import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { NgFor, NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { LocalRepository } from '../../core/local-store/local-repository';
import { CreateListDialogComponent } from '../../shared/components/create-list-dialog/create-list-dialog.component';

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
  navItems = [
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
    private dialog: Dialog,
  ) {

  }

  ngOnInit(): void {
    if (!this._localRepository.IsInBrowser) return;
    this.isDesktop = window.innerWidth > 768;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (!this._localRepository.IsInBrowser) return;
    this.isDesktop = window.innerWidth > 768;
  }


  handleAddList(): void {
    this.dialog.open(CreateListDialogComponent);
  }

}
