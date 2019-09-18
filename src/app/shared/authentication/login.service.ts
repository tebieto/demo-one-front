import { Injectable} from '@angular/core';
import { throwError} from 'rxjs';
import { Http, Headers, Response} from '@angular/http';
import { map, catchError} from 'rxjs/operators';
import { Config } from 'src/app/config';


@Injectable({
  providedIn: 'root'
})

export class LoginService {

  baseUrl: string

  constructor(
    private http: Http, 
  ) { }

  user(data: object){
    this.baseUrl = Config.api+ 'user/login'
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

  recovery(data: object){
    this.baseUrl = Config.api+ 'user/password/reset'
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

  recover(data: object){
    this.baseUrl = Config.api+ 'user/password/reset/change'
    return this.http.put(
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

  verifyCode(data: object){
    this.baseUrl = Config.api+ 'user/password/code/validate'
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

  verifyInviteCode(data: object){
    this.baseUrl = Config.api+ 'invite/validate'
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

  admin(data: object){
    this.baseUrl = Config.api+ 'admin/login'
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

  owner(data: object){
    this.baseUrl = Config.api+ 'owner/login'
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

  acceptInvite(data: object){
    this.baseUrl = Config.api+ 'invite/accept'
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
