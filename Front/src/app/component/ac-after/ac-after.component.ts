import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../../auth.service';

@Component({
  standalone: true,
  selector: 'app-ac-after',
  imports: [RouterModule,RouterOutlet,CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './ac-after.component.html',
  styleUrl: './ac-after.component.css'
})

export class AcAfterComponent implements OnInit {
  username: string | null = '';
  menuOpen: boolean = false;

  constructor(private router: Router,private location: Location,private route: ActivatedRoute,private authService: AuthService) {}

  ngOnInit(): void {
    // Fetch the username from the AuthService
    this.username = this.authService.getUser();
  }

  navigateTo(page: any): void {
    this.router.navigate(['Sendage']); // Naviguer vers une autre page comme /profile ou /settings.
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    // Implémentez la déconnexion ici
    console.log('Déconnexion');
    this.router.navigate(['']);
  }
}



