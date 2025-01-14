import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterOutlet,Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';

@Component({
  standalone: true,
  selector: 'app-nav-after',
  imports: [RouterModule, RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './nav-after.component.html',
  styleUrl: './nav-after.component.css'
})
export class NavAfterComponent implements OnInit{
  userEmail: string = '';

  ngOnInit(): void {
    this.userEmail = this.sharedService.getEmail();
    console.log('User Email:', this.userEmail);
  }
  profileMenuVisible = false;

  // Afficher le menu
  showProfileMenu() {
    this.profileMenuVisible = true;
  }

  // Garder le menu ouvert
  keepProfileMenu() {
    this.profileMenuVisible = true;
  }

  // Masquer le menu lorsque la souris sort de l'image et du menu
  hideProfileMenu() {
    this.profileMenuVisible = false;
  }

  // Navigation vers le profil
  goToProfile(): void {
    this.router.navigate(['/Profil']);
  }

  // Aller à Mes Votes
  goToVotes(): void {
    const email = localStorage.getItem(this.userEmail); // Récupérer l'email
    if (email) {
      this.router.navigate(['/mes-votes', email]); // Rediriger vers l'URL dynamique
    } else {
      console.error('Email not found in localStorage.');
      alert('Please log in first.');
    }
  }

  menuOpen: boolean = false;

  constructor(private router: Router,private route : ActivatedRoute,private sharedService: SharedService){}
  
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  logout(): void {
    localStorage.removeItem(this.userEmail); // Supprimer du localStorage
    this.sharedService.setEmail(''); // Réinitialiser l'email dans le service
    this.router.navigate(['']);
  }
}
