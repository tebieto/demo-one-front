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

  getCommonHeaders(){
    let headers = new Headers();
    headers.append("content-type", "application/json");
    return headers
  }

  handleErrors(error: Response) {
    return throwError(error);
  }

}
