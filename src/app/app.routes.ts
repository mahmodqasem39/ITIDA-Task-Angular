import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { TimesheetComponent } from './timesheet/timesheet.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegistrationComponent },
    { path: 'timesheet', component: TimesheetComponent }, 
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
