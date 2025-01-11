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
  newSurveyStartTime: string = '';
  newSurveyTitle: string = '';
  newOption: string = '';
  newSurveyOptions: string[] = [];
  newSurveyEndTime: string = '';
  newSurveyType: string = 'Vote'; // Default value, can be 'Vote' or 'Sondage'
  // Ajouter le type 'Vote' ou 'Sondage' dans la définition des sondages
  surveys: { id: number, title: string, options: string[], type: string, start_date: string, end_date: string }[] = []; // Ajoute le type 'Vote' ou 'Sondage'
  activeSurvey: { id: number, title: string, options: string[], type: string, start_date: string, end_date: string } | null = null; // Ajoute le type 'Vote' ou 'Sondage'
  voteMode: boolean = false;
  userVoted: boolean = false;
  minDate: string = '';
  selectedOption: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    const now = new Date();
    this.minDate = now.toISOString().slice(0, 16); // Set minDate to current time
  }

// Add options, validate title and create survey with type
createSurvey(): void {
  const startTime = new Date(this.newSurveyStartTime); // Nouvelle date de début
  const endTime = new Date(this.newSurveyEndTime); // Date de fin
  
  // Vérification des dates
  if (isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
    alert('Veuillez sélectionner des dates valides pour le début et la fin.');
    return;
  }

  if (startTime <= new Date()) {
    alert('La date de début doit être dans le futur.');
    return;
  }

  if (endTime <= startTime) {
    alert('La date de fin doit être après la date de début.');
    return;
  }

  // Vérifier l'email du créateur
  const creatorEmail = localStorage.getItem('email'); // Récupérer l'email du créateur
  if (!creatorEmail) {
    alert('Vous devez être connecté pour créer un sondage.');
    return;
  }

  // Vérifier le titre et les options
  if (this.newSurveyTitle.trim() && this.newSurveyOptions.length > 1) {
    this.http.post('http://localhost:3000/polls', {
      title: this.newSurveyTitle,
      options: this.newSurveyOptions,
      start_date: this.newSurveyStartTime, // Ajouter la date de début
      data_fin: this.newSurveyEndTime, // Date de fin
      type: this.newSurveyType, // Inclure le type
      creator_email: creatorEmail // Ajouter le créateur
    }).subscribe((data: any) => {
      this.surveys.push({
        id: data.pollId,
        title: this.newSurveyTitle,
        options: [...this.newSurveyOptions],
        start_date: this.newSurveyStartTime, // Ajouter la date de début
        end_date: this.newSurveyEndTime, // Ajouter la date de fin
        type: this.newSurveyType // Ajouter le type ici aussi
      });

      // Réinitialiser les champs
      this.newSurveyTitle = '';
      this.newSurveyOptions = [];
      this.newSurveyStartTime = ''; // Réinitialiser la date de début
      this.newSurveyEndTime = ''; // Réinitialiser la date de fin
      this.newSurveyType = 'Vote'; // Réinitialiser le type
    }, err => {
      console.error('Erreur lors de la création du sondage', err);
    });
  } else {
    alert('Veuillez remplir un titre et au moins deux options.');
  }
}


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

  // Récupérer les sondages
  getSurveys(): void {
    this.http.get('http://localhost:3000/polls').subscribe((data: any) => {
      this.surveys = data.map((survey: any) => ({
        id: survey.id,
        title: survey.title,
        options: JSON.parse(survey.options),
        type: survey.type // Ajoute le type à chaque sondage
      }));
    }, err => {
      console.error('Error fetching surveys', err);
    });
  }
  

  // Commencer à voter pour un sondage
  startVoting(survey: { id: number, title: string, options: string[], type: string, start_date: string, end_date: string }): void {
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
        this.selectedOption = option;  // Track the selected option
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
  editSurvey(survey: { id: number, title: string, options: string[], type: string, start_date: string, end_date: string }): void {
    this.newSurveyTitle = survey.title;
    this.newSurveyOptions = [...survey.options];
    this.deleteSurvey(survey); // Supprimer le sondage original avant de le modifier
  }

  // Supprimer un sondage
  deleteSurvey(survey: { id: number, title: string, options: string[], type: string, start_date: string, end_date: string }): void {
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
