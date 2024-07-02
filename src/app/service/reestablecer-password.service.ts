import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SendEmail } from '../models/usuario.model';
import { Password_Reset, Password_Reset_Confirm } from '../models/api.model';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReestablecerPasswordService {

  public passReset = Password_Reset;
  public passResetConfirm = Password_Reset_Confirm;

  constructor(private http: HttpClient) { }

  //base_url = 'http://127.0.0.1:8000/api/password_reset/';
  //resetPasswordUrl = `http://localhost:8000/api/password_reset/confirm/?token`

  sendEmailPassword(email:SendEmail) {
    //const url = this.base_url;
    //return this.http.post(url, email );
    const url = `${this.passReset}`
    return this.http.post(url, email);
  }

  resetPassword(token: string, password: string ): Observable<any> {
    const resetData = { token, password };
    //const apiUrl = `${this.resetPasswordUrl}`;
    const apiUrl = `${this.passResetConfirm}`;
    return this.http.post(apiUrl, resetData);
  }
}



