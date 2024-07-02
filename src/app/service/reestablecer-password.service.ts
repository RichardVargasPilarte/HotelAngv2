import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SendEmail } from '../models/usuario.model';
import { environment } from '../../environments/environment.prod';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReestablecerPasswordService {

  public api = environment.API_URI;
  public passReset = 'password_reset';
  public passResetConfirm = 'password_reset/confirm/?token';

  constructor(private http: HttpClient) { }

  //base_url = 'http://127.0.0.1:8000/api/password_reset/';
  //resetPasswordUrl = `http://localhost:8000/api/password_reset/confirm/?token`

  sendEmailPassword(email:SendEmail) {
    //const url = this.base_url;
    //return this.http.post(url, email );
    const url = `${this.api}/${this.passReset}/`
    return this.http.post(url, email);
  }

  resetPassword(token: string, password: string ): Observable<any> {
    const resetData = { token, password };
    //const apiUrl = `${this.resetPasswordUrl}`;
    const apiUrl = `${this.api}/${this.passResetConfirm}`;
    return this.http.post(apiUrl, resetData);
  }
}



