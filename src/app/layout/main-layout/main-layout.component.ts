import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import {
  ContactInfoService,
  ContactInfo,
} from '../../services/contact-info.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent implements OnInit {
  private authService = inject(AuthService);
  private contactService = inject(ContactInfoService);
  themeService = inject(ThemeService);

  isAuthenticated = this.authService.isAuthenticated;

  contactInfo?: ContactInfo;

  ngOnInit() {
    this.contactService.getContactInfo().subscribe((info) => {
      this.contactInfo = info;
    });
  }

  logout() {
    this.authService.logout();
  }
}
