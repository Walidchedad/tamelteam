import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poll-detail',
  standalone: true,
  imports: [HttpClientModule, RouterOutlet, RouterModule, CommonModule],
  templateUrl: './poll-detail.component.html',
  styleUrls: ['./poll-detail.component.css'],
})
export class PollDetailComponent implements OnInit {
  poll: any = null; // Holds the poll details
  activeSurvey: any = null; // Tracks the active survey for voting
  voteMode: boolean = true; // Controls voting mode
  userVoted: boolean = false; // Tracks if the user has already voted
  selectedOption: string | null = null; // Tracks the selected option for 'Sondage' type polls
  errorMessage: string = ''; // Tracks error messages
  isCreator: boolean = false; // Tracks if the logged-in user is the creator
  alertMessage: string = ''; // To store the alert message
  alertType: string = ''; // To store the alert type ('success', 'warning', etc.)
  isPollExpired: boolean = false; // Flag to track if the poll is expired
  pollStatistics: { [key: string]: { voteCount: number, percentage: number } } = {};

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const pollId = this.route.snapshot.paramMap.get('id');
    if (pollId) {
      this.fetchPollDetails(pollId);
    }
    if (pollId) {
      this.getPollStatistics(pollId);
    }
  }

  getPollStatistics(pollId: string): void {
    this.http.get(`http://localhost:3000/polls/${pollId}/statistics`).subscribe(
      (stats: any) => {
        // Arrondir les pourcentages à des valeurs entières
        for (let option in stats) {
          if (stats.hasOwnProperty(option)) {
            stats[option].percentage = Math.round(stats[option].percentage); // Arrondi du pourcentage à l'entier le plus proche
          }
        }
        this.pollStatistics = stats;
      },
      (error) => {
        console.error('Error retrieving poll statistics:', error);
      }
    );
  }
  
  

  // Fetch poll details from the backend
  fetchPollDetails(pollId: string): void {
    this.http.get(`http://localhost:3000/polls/${pollId}`).subscribe(
      (pollData: any) => {
        this.poll = pollData;
        this.activeSurvey = {
          id: pollData.id,
          title: pollData.title,
          options: pollData.options,
          type: pollData.type, // 'Vote' or 'Sondage'
          dateFin: pollData.date_fin, // Add date_fin to the survey data
        };
        this.checkIfCreator(pollData.creatorEmail); // Check if the logged-in user is the creator
        this.checkPollExpiration(pollData.date_fin); // Check if the poll is expired
      },
      (error) => {
        console.error('Error fetching poll details:', error);
        this.errorMessage = 'Error fetching poll details.';
      }
    );
  }

  // Function to check if the poll has expired
  checkPollExpiration(dateFin: string): void {
    const currentDate = new Date();
    const endDate = new Date(dateFin); // Convert the date_fin to a Date object

    if (currentDate > endDate) {
      this.isPollExpired = true;
      this.showAlert('Le sondage est terminé, vous ne pouvez plus voter.', 'warning');
    }
  }

  // Cast a vote
  castVote(option: string): void {
    if (this.isCreator) {
      this.showAlert('Vous ne pouvez pas voter pour votre propre sondage.', 'warning');
      return;
    }

    if (this.isPollExpired) {
      this.showAlert('Le sondage est terminé, vous ne pouvez plus voter.', 'warning');
      return;
    }

    if (this.activeSurvey?.type === 'Vote' && this.userVoted) {
      this.showAlert('Vous avez déjà voté.', 'warning');
      return;
    }

    const email = localStorage.getItem('email'); // Retrieve the logged-in user's email
    if (!email) {
      this.showAlert('Veuillez vous connecter pour voter.', 'warning');
      return;
    }

    // Send vote data to the backend
    const voteData = { option, email };
    this.http.post(`http://localhost:3000/polls/${this.activeSurvey.id}/vote`, voteData).subscribe(
      () => {
        if (this.activeSurvey.type === 'Vote') {
          this.userVoted = true;
        } else if (this.activeSurvey.type === 'Sondage') {
          this.selectedOption = option;
        }
        this.showAlert('Votre vote a été soumis avec succès !', 'success');
        this.getPollStatistics(this.activeSurvey.id);
        this.updatePollStatistics(option);
      },
      (error) => {
        console.error('Error submitting vote:', error);
        this.showAlert(error.error.message, 'danger'); // Display the error message from the backend
      }
    );
  }
  updatePollStatistics(option: string): void {
    const totalVotes = Object.values(this.pollStatistics).reduce((acc, value) => acc + value.voteCount, 0);
  
    // Réinitialiser les pourcentages
    Object.keys(this.pollStatistics).forEach((opt) => {
      const optionVotes = this.pollStatistics[opt].voteCount;
      const percentage = totalVotes > 0 ? (optionVotes / totalVotes) * 100 : 0;
      this.pollStatistics[opt].percentage = percentage;
    });
  
    // Mettre 100% pour l'option sélectionnée
    this.pollStatistics[option].percentage = 100;
  
    // Mettre 0% pour les autres options
    Object.keys(this.pollStatistics).forEach((opt) => {
      if (opt !== option) {
        this.pollStatistics[opt].percentage = 0;
      }
    });
  }
  

  checkIfCreator(creatorEmail: string): void {
    const userEmail = localStorage.getItem('email'); // Retrieve the logged-in user's email
    if (userEmail) {
      this.isCreator = userEmail === creatorEmail; // Compare with creator's email
    } else {
      console.warn('No email found in localStorage.');
      this.isCreator = false;
    }
  }

  // Display alert message
  showAlert(message: string, type: string): void {
    this.alertMessage = message;
    this.alertType = type;
  }

  // End voting
  endVoting(): void {
    this.voteMode = false;
    this.activeSurvey = null;
    this.selectedOption = null; // Reset selection for 'Sondage'
  }
}
