import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


import { environment } from '../../environments/environment';

@Injectable()

export class HealthDataService {

  constructor(
    private http: HttpClient,
  ){ }

  public getActivityData = (month: string): Observable<any> => {
    const endpoint = `${environment.activityDataURL}?month=${month}`;
    return this.http.get<any>(endpoint)
      .pipe(catchError(this.handleError));
  }

  public getSleepData = (month: string): Observable<any> => {
    const endpoint = `${environment.sleepDataURL}?month=${month}`;
    return this.http.get<any>(endpoint)
      .pipe(catchError(this.handleError));
  }

  private handleError = (error) => {
    let errorMessage = '';
    console.log(error)
    if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = `Error: ${error.error.message}`;
    } else {
        // server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    alert(`Could not obtain data\n${errorMessage}`);
    console.log(errorMessage);
    return throwError(errorMessage);
   }

}
