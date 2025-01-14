import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../shared/shared.service';


@Component({
  selector: 'app-profil',
  imports: [CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  sidebarVisible: boolean = false;

  toggleSidebar() {
    this.sidebarVisible = !this.sidebarVisible;
  }
  
  constructor(private router: Router,private sharedService: SharedService) {}

  userEmail: string = '';

  ngOnInit(): void {
    this.userEmail = this.sharedService.getEmail();
    console.log('User Email:', this.userEmail);
  }

  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);  // Navigate to the desired page
  }

  navigateToMyPolls() {
    const email = localStorage.getItem(this.userEmail); // Récupérer l'email du localStorage
    if (email) {
      this.router.navigate([`/mes-votes`, email]);
    } else {
      alert('Vous devez être connecté pour voir vos sondages.');
    }
  }
}
