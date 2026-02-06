import { Component, inject, OnInit, ViewChild, signal } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
  Router,
  NavigationEnd,
} from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { BreakpointObserver } from '@angular/cdk/layout';
import {
  ContactInfoService,
  ContactInfo,
} from '../../services/contact-info.service';
import { ThemeService } from '../../services/theme.service';
import { filter } from 'rxjs/operators';

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
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);

  @ViewChild('sidenav') sidenav!: MatSidenav;

  isAuthenticated = this.authService.isAuthenticated;
  contactInfo?: ContactInfo;
  isMobile = signal(false);

  ngOnInit() {
    this.contactService.getContactInfo().subscribe((info) => {
      this.contactInfo = info;
    });

    // Responsive Sidenav Logic
    this.breakpointObserver
      .observe(['(max-width: 800px)'])
      .subscribe((result) => {
        this.isMobile.set(result.matches);
      });

    // Close sidenav on navigation (only on mobile)
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.isMobile()) {
          this.sidenav.close();
        }
      });
  }

  logout() {
    this.authService.logout();
  }
}
