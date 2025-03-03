import { Injectable} from '@angular/core';
import { throwError} from 'rxjs';
import { Http, Headers, Response} from '@angular/http';
import { map, catchError} from 'rxjs/operators';
import { Config } from 'src/app/config';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {


  baseUrl: string

  constructor(
    private http: Http, 
  ) { }

  newUser(data: object){
    this.baseUrl = Config.api+ 'user/register'
    return this.http.post(
      this.baseUrl,
      data,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );
  }

  newAdmin(data: object){
    this.baseUrl = Config.api+ 'admin/register'
    return this.http.post(
      this.baseUrl,
      data,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  newOwner(data: object){
    this.baseUrl = Config.api+ 'owner/register'
    return this.http.post(
      this.baseUrl,
      data,
      {headers:this.getCommonHeaders()}
    ).pipe(
      map(res => res.json()),
      map(data => {
          return data;
      }),

      catchError(this.handleErrors)
    );

  }

  newSpecial(data: object){
    this.baseUrl = Config.api+ 'special/register'
    return this.http.post(
      this.baseUrl,
      data,
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
    let headers = new Headers();
    headers.append("content-type", "application/json");
    return headers
  }

  handleErrors(error: Response) {
    return throwError(error);
  }
}
