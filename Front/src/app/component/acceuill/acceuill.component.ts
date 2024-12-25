import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-acceuill',
  imports: [RouterModule, RouterOutlet, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './acceuill.component.html',
  styleUrl: './acceuill.component.css'
})
export class AcceuillComponent {
}
