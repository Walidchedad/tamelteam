import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';


@Component({
  selector: 'app-aj-send',
  standalone: true,
  imports: [RouterModule, RouterOutlet, FormsModule, CommonModule, HttpClientModule],
  templateUrl: './aj-send.component.html',
  styleUrl: './aj-send.component.css'
})

export class AjSendComponent {
  newSurveyTitle: string = '';
  newOption: string = '';
  newSurveyOptions: string[] = [];
  surveys: { id: number, title: string, options: string[] }[] = []; // Add `id` to the survey
  voteMode: boolean = false;
  activeSurvey: { id: number, title: string, options: string[] } | null = null; // Add `id` to activeSurvey
  userVoted: boolean = false;

  constructor(private http: HttpClient, private router: Router) {}

  // Ajouter une nouvelle option
  addOption(): void {
    if (this.newOption.trim()) {
      this.newSurveyOptions.push(this.newOption.trim());
      this.newOption = '';
    } else {
      alert('Veuillez entrer au moins deux options.');
    }
  }

  // Supprimer une option
  removeOption(index: number): void {
    this.newSurveyOptions.splice(index, 1);
  }

  // Créer un nouveau sondage
  createSurvey(): void {
    if (this.newSurveyTitle.trim() && this.newSurveyOptions.length > 1) {
      this.http.post('http://localhost:3000/polls', {
        title: this.newSurveyTitle,
        options: this.newSurveyOptions
      }).subscribe((data: any) => {
        // Assuming the backend returns the new poll with its ID
        this.surveys.push({
          id: data.pollId, // Use the returned ID from the backend
          title: this.newSurveyTitle,
          options: [...this.newSurveyOptions]
        });
        this.newSurveyTitle = '';
        this.newSurveyOptions = [];
      }, err => {
        console.error('Error creating survey', err);
      });
    } else {
      alert('Veuillez remplir un titre et au moins deux options.');
    }
  }

  // Récupérer les sondages
  getSurveys(): void {
    this.http.get('http://localhost:3000/polls').subscribe((data: any) => {
      this.surveys = data.map((survey: any) => ({
        id: survey.id, // Ensure the `id` is included in each survey
        title: survey.title,
        options: JSON.parse(survey.options) // Assuming options are stored as a JSON string
      }));
    }, err => {
      console.error('Error fetching surveys', err);
    });
  }

  // Commencer à voter pour un sondage
  startVoting(survey: { id: number, title: string, options: string[] }): void {
    this.voteMode = true;
    this.activeSurvey = survey;
    this.checkIfUserVoted(survey.id); // Check if the user has already voted
  }

  checkIfUserVoted(surveyId: number): void {
    const email = localStorage.getItem('email'); // Retrieve email of the logged-in user
    if (!email) {
      alert('Please log in to vote.');
      return;
    }

    this.http.get(`http://localhost:3000/polls/${surveyId}/user-vote-status?email=${email}`).subscribe(
      (data: any) => {
        if (data.hasVoted) {
          this.userVoted = true;
        }
      },
      (error) => {
        console.error('Error checking vote status:', error);
      }
    );
  }

  // Voter pour une option
  castVote(option: string): void {
    const email = localStorage.getItem('email'); // Retrieve email of the logged-in user
    const surveyId = this.activeSurvey?.id; // Get the active survey ID
    
    if (!email) {
      alert('Email not found. Please log in again.');
      return;
    }
  
    // Prepare the vote data to send to the backend
    const voteData = { option, email };
  
    // Send the vote to the backend
    this.http.post(`http://localhost:3000/polls/${surveyId}/vote`, voteData)
      .subscribe(
        (response) => {
          console.log('Vote submitted successfully:', response);
          this.userVoted = true;  // Mark the user as voted
        },
        (error) => {
          console.error('Error submitting vote:', error);
        }
      );
  }

  // Terminer le vote
  endVoting(): void {
    this.voteMode = false;
    this.activeSurvey = null;
  }

  // Modifier un sondage (modifier le titre et/ou les options)
  editSurvey(survey: { id: number, title: string, options: string[] }): void {
    this.newSurveyTitle = survey.title;
    this.newSurveyOptions = [...survey.options];
    this.deleteSurvey(survey); // Supprimer le sondage original avant de le modifier
  }

  // Supprimer un sondage
  deleteSurvey(survey: { id: number, title: string, options: string[] }): void {
    const index = this.surveys.indexOf(survey);
    if (index > -1) {
      this.surveys.splice(index, 1);
      this.http.delete(`http://localhost:3000/polls/${survey.id}`).subscribe(() => {
        alert('Sondage supprimé');
      }, err => {
        console.error('Error deleting survey', err);
      });
    }
  }
}
