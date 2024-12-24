import { Routes } from '@angular/router';
import { NavbarComponent } from './component/navbar/navbar.component';
import { AcceuillComponent } from './component/acceuill/acceuill.component';

export const routes: Routes = [
    {path:'',component:NavbarComponent,children:[
        {path:'Acceuil',component:AcceuillComponent},
    ]},
];
