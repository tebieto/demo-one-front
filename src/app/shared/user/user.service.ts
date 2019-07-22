import { Injectable} from '@angular/core';
import { throwError} from 'rxjs';
import { Http, Headers, Response} from '@angular/http';
import { map, catchError} from 'rxjs/operators';
import { Config } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl: string
  locationUrl: string

  constructor(
    private http: Http, 
  ) { }

  getLocation(){
    this.locationUrl = Config.ipChecker
    return this.http.get(
      this.locationUrl
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  validateUser(){
    this.baseUrl = Config.api + 'token/validate'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  superAdmin(){
    this.baseUrl = Config.api + 'admin/super/exist'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  appOwner(){
    this.baseUrl = Config.api + 'owner/exist'
    return this.http.get(
      this.baseUrl,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  getCommonHeaders(){
    let token = localStorage.getItem('token')
    let bearer = Config.bearer+''+token
    let headers = new Headers();
    headers.append("content-type", "application/json");
    headers.append("authorization", bearer);
    return headers
  }

  handleErrors(error: Response) {
    return throwError(error);
  }

}
