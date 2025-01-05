import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PollService {
  private apiUrl = 'http://localhost:3000';  // Your backend API URL

  constructor(private http: HttpClient) {}

  // Get all polls
  getPolls(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/polls`);
  }

  // Create a new poll
  createPoll(title: string, description: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create-poll`, { title, description, createdBy: 1 });
  }
}
