import { NgIf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { LocalRepository } from '../../core/local-store/local-repository';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    NgIf,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  isDesktop = true;

  constructor(
    private _localRepository: LocalRepository,
  ) {

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    if (!this._localRepository.IsInBrowser) return;
    this.isDesktop = window.innerWidth > 768;
  }

  ngOnInit(): void {
    if (!this._localRepository.IsInBrowser) return;
    this.isDesktop = window.innerWidth > 768;
  }
}
