import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()

export class HealthDataService {

  constructor(
    private http: HttpClient,
  ){ }

  public getActivityData(): Observable<any> {
    return this.http.get<any>(environment.activityDataURL);
  }

  public getSleepData(): Observable<any> {
    return this.http.get<any>(environment.sleepDataURL);
  }

}
