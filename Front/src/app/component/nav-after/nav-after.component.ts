import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterOutlet,Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-nav-after',
  imports: [RouterModule, RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nav-after.component.html',
  styleUrl: './nav-after.component.css'
})
export class NavAfterComponent {
  menuOpen: boolean = false;
  constructor(private router: Router,private route : ActivatedRoute,){}
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    // Implémentez la déconnexion ici
    console.log('Déconnexion');
    this.router.navigate(['']);
  }
}
