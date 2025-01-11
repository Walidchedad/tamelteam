import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-poll-list',
  standalone: true,
  templateUrl: './poll-list.component.html',
  styleUrls: ['./poll-list.component.css'],
  imports: [RouterModule, RouterOutlet,HttpClientModule,CommonModule,FormsModule],
})
export class PollListComponent implements OnInit {
  polls: any[] = [];
  filteredPolls: any[] = []; // Liste filtrée des sondages
  searchQuery: string = ''; // Terme de recherche
  filterStatus: string = 'all'; // Filtre actif ('all', 'pending', 'active', 'closed')
  isFilterDropdownOpen: boolean = false; // État du menu déroulant de filtre

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadPolls();
  }

  fetchPolls(): void {
    this.http.get<any[]>('http://localhost:3000/polls').subscribe(
      (data) => {
        this.polls = data;
      },
      (err) => {
        console.error('Error fetching polls', err);
      }
    );
  }
  
  loadPolls(): void {
    this.http.get('http://localhost:3000/polls').subscribe(
      (data: any) => {
        this.polls = data; // Remplir la liste des sondages
        this.filteredPolls = [...this.polls]; // Initialiser la liste filtrée
      },
      (err) => console.error('Erreur lors du chargement des sondages', err)
    );
  }

  searchPolls() {
    if (this.searchQuery.trim() !== '') {
      this.filteredPolls = this.polls.filter(poll =>
        poll.title.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.filteredPolls = this.polls; // Si la barre est vide, afficher tous les sondages
    }
  }

  toggleFilterDropdown(): void {
    this.isFilterDropdownOpen = !this.isFilterDropdownOpen;
  }
  /**
   * Appliquer les filtres de recherche et de statut
   */
  filterPolls(): void {
    const currentDate = new Date();
  
    if (this.filterStatus === 'closed') {
      // Filtrer les sondages clôturés (date actuelle > data_fin)
      this.filteredPolls = this.polls.filter(poll => new Date(poll.data_fin) < currentDate);
    } else if (this.filterStatus === 'pending') {
      // Filtrer les sondages en attente (date actuelle < start_date)
      this.filteredPolls = this.polls.filter(poll => new Date(poll.start_date) > currentDate);
    } else if (this.filterStatus === 'active') {
      // Filtrer les sondages actifs (start_date <= date actuelle <= data_fin)
      this.filteredPolls = this.polls.filter(poll => {
        const startDate = new Date(poll.start_date);
        const endDate = new Date(poll.data_fin);
        return startDate <= currentDate && currentDate <= endDate;
      });
    } else {
      // Réinitialiser à tous les sondages si "all" ou valeur par défaut
      this.filteredPolls = [...this.polls];
    }
  }
  

  /**
   * Modifier le filtre par statut et appliquer les filtres
   */
  filterByStatus(status: string): void {
    this.filterStatus = status; // Mettre à jour le filtre actif
    this.filterPolls(); // Réappliquer les filtres
  }

  /**
   * Obtenir le statut d'un sondage
   */
  getPollStatus(poll: any): string {
    const now = new Date();
    const startDate = new Date(poll.start_date);
    const endDate = new Date(poll.data_fin);

    if (now < startDate) {
      return 'pending'; // En attente
    } else if (now >= startDate && now <= endDate) {
      return 'active'; // Actif
    } else {
      return 'closed'; // Clôturé
    }
  }
  // Define the method to handle viewing a poll
  viewPoll(pollId: number): void {
    // Here, you can navigate to a different page to show the poll details
    this.router.navigate(['/poll-detail', pollId]); // Example navigation to the detail view
  }

  // Method to check if the poll is pending
  isPollPending(startDate: string): boolean {
    const currentDate = new Date();
    const start = new Date(startDate);
    return currentDate < start;
  }

  // Method to check if the poll is active
  isPollActive(startDate: string, endDate: string): boolean {
    const currentDate = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return currentDate >= start && currentDate <= end;
  }

  // Method to check if the poll is closed
  isPollClosed(endDate: string): boolean {
    const currentDate = new Date();
    const end = new Date(endDate);
    return currentDate > end;
  }

}


  