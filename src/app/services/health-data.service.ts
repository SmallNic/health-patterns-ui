import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
// import { catch, do, map } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable()

export class HealthDataService {

  constructor(
    private _http: HttpClient,
  ){ }

  getActivityData(): Observable<any> {
    return this._http.get<any>(environment.activityDataURL);
      // .catch(this.handleError);
  }

  getSleepData(): Observable<any> {
    return this._http.get<any>(environment.sleepDataURL);
      // .catch(this.handleError);
  }


  // private handleError( err:HttpErrorResponse ){
  //   console.log( err.message );
  //   return Observable.throw( err.message );
  // }
}
