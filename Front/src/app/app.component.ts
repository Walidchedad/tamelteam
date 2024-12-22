import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./component/navbar/navbar.component";
import { AcceuillComponent } from "./component/acceuill/acceuill.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, AcceuillComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'frontend';
}
