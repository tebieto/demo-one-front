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
  token = localStorage.getItem('token')
  bearer = Config.bearer+''+this.token

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

  validate(){
   
    this.baseUrl = Config.api + 'user/validate'
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
    let headers = new Headers();
    headers.append("content-type", "application/json");
    headers.append("authorization", this.bearer);
    return headers
  }

  handleErrors(error: Response) {
    return throwError(error);
  }

}
