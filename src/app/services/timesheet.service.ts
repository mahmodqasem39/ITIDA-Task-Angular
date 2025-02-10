import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TimesheetService {

  private timesheetUrl = 'http://localhost:5296/api/Timesheet/GetAll'; 
  private creaetimesheetUrl = 'http://localhost:5296/api/Timesheet/Add'; 
  private deletetimesheetUrl = 'http://localhost:5296/api/Timesheet/Delete'; 


  constructor(private http: HttpClient, private authService: AuthService) {}

  getTimesheets(): Observable<any[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.error('User ID is missing');
      return throwError(() => new Error('User ID is required'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, 
    });

    return this.http.get<any[]>(`${this.timesheetUrl}?userId=${userId}`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching timesheet data:', error);
        return throwError(() => new Error('Failed to fetch timesheet data'));
      })
    );
  }

  createTimeSheet(timesheet: any): Observable<any> {
    timesheet.userID = this.authService.getUserId()
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
    return this.http.post(`${this.creaetimesheetUrl}`, timesheet,{headers});
  }

  deleteTimeSheet(id: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`, 
    });
    return this.http.delete(`${this.deletetimesheetUrl}?id=${id}`, {
      responseType: 'text'
      ,headers
    }).pipe(
      catchError(error => {
        console.error('Error deleting timesheet data:', error);
        return throwError(() => new Error('Failed to delete timesheet data'));
      })
    );
  }
}
