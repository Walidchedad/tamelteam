import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceuill',
  imports: [RouterModule, RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './acceuill.component.html',
  styleUrls: ['./acceuill.component.css',]
})

export class AcceuillComponent{
  menuOpen: boolean = false;
  constructor(private route : ActivatedRoute,private router: Router){}
  showAlert: boolean = false;
  alertMessage: string = '';

  showCustomAlert(): void {
    this.alertMessage = "Vous allez être redirigé vers la page de connexion...";
    this.showAlert = true;

    // Masquer l'alerte après 5 secondes
    setTimeout(() => {
      this.router.navigate(['Login']);
    }, 2500);
  }
  // Fonction pour gérer le clic sur le bouton
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
