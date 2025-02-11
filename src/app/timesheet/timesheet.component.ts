import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { TimesheetService } from '../services/timesheet.service';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-timesheet',
  imports: [NgFor,FormsModule,NgIf,ReactiveFormsModule],
  templateUrl: './timesheet.component.html',
  styleUrl: './timesheet.component.css'
})
export class TimesheetComponent {
  timesheets: any[] = [];
  isLoading = true;
  errorMessage = '';
  editIndex: number | null = null;
  newTimesheetForm: FormGroup;
  today: string = new Date().toISOString().split('T')[0];


  constructor(private timesheetService: TimesheetService,private fb: FormBuilder,private router: Router) {
    this.newTimesheetForm = this.fb.group({
      registerDate: ['',[Validators.required]],
      loginTime: ['',[Validators.required]],
      logoutTime: ['',[Validators.required]],
      userID: [''],
      totalLoggedHours: [{ value: '', disabled: true }],
    },{ validators: logoutAfterLoginValidator() });
  }

  ngOnInit() {
    this.fetchTimesheetData();
  }

  fetchTimesheetData() {
    this.timesheetService.getTimesheets().subscribe({
      next: (data) => {
        this.timesheets = data;
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.message;
        this.isLoading = false;
      }
    });
  }

  enableEdit(index: number) {
    this.editIndex = index;
  }

  saveEdit(timesheet: any) {
    this.timesheetService.updateTimeSheet(timesheet).subscribe({
      next: () => {
        this.editIndex = null;
        this.fetchTimesheetData();
      },
      error: (error) => console.error('Error updating timesheet:', error)
    });
  }

  addNewTimesheet() {
    this.newTimesheetForm.markAllAsTouched();
    if (this.newTimesheetForm.valid) {
      this.timesheetService.createTimeSheet(this.newTimesheetForm.value).subscribe({
        next: () => {
          this.fetchTimesheetData();
          this.newTimesheetForm.reset();
          this.isLoading = false;
          this.errorMessage = '';
        },
        error: (error) => {
          if (error.error && error.error.errors) {
            const messages = Object.values(error.error.errors).flat();
            this.errorMessage = messages.join('<br>'); 
          } else {
            this.errorMessage = 'An unexpected error occurred.';
          }
        }
      });
    }
  }

  deleteTimesheet(id: number) {
    this.timesheetService.deleteTimeSheet(id).subscribe({
      next: () => {
        this.fetchTimesheetData();
        this.isLoading = false;
      },
      error: (error) => console.error('Error deleting timesheet:', error)
    });
  }

  signOut(): void {
    this.timesheetService.signOut().subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']); 
      },
      error: (error) => console.error('Error duning sign out:', error)
    });
  }
}

export function logoutAfterLoginValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const loginTime = control.get('loginTime')?.value;
    const logoutTime = control.get('logoutTime')?.value;

    if (loginTime && logoutTime && logoutTime <= loginTime) {
      return { logoutAfterLogin: true }; 
    }
    return null; 
  };

}