import { Routes } from '@angular/router';
import { NavbarComponent } from './component/navbar/navbar.component';
import { AcceuillComponent } from './component/acceuill/acceuill.component';
import { LoginComponent } from './component/login/login.component';
import { AcAfterComponent } from './component/ac-after/ac-after.component';
import { NavAfterComponent } from './component/nav-after/nav-after.component';// Ensure this path is correct and the file exists
import { AjSendComponent } from './component/aj-send/aj-send.component';
import { PollListComponent } from './component/poll-list/poll-list.component';
import { PollDetailComponent } from './component/poll-detail/poll-detail.component';

export const routes: Routes = [
    {path:'Login', component: LoginComponent},
    {path:'',component:NavbarComponent,children:[
        {path:'',component:AcceuillComponent,children:[
            {path:'Login',component:LoginComponent},
        ]},
        {path:'',component:AcceuillComponent},
        {path:'Login',component:LoginComponent},
    ]},
    {path:'', component: NavAfterComponent, children:[
        {path:'Acc_after_login',component:AcAfterComponent},
        {path:'Sendage',component:AjSendComponent},
        {path:'Voter',component:PollListComponent},
        {path:'poll-detail/:id',component:PollDetailComponent},
    ]}
];