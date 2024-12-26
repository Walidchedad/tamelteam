import { Routes } from '@angular/router';
import { NavbarComponent } from './component/navbar/navbar.component';
import { AcceuillComponent } from './component/acceuill/acceuill.component';
import { LoginComponent } from './component/login/login.component';

export const routes: Routes = [
    {path:'Login', component: LoginComponent},
    {path:'',component:NavbarComponent,children:[
        {path:'',component:AcceuillComponent,children:[
            {path:'Login',component:LoginComponent},
        ]},
        {path:'',component:AcceuillComponent},
        {path:'Login',component:LoginComponent}
    ]},
];