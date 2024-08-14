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
  sendEmailPassword(email:SendEmail) {
    const url = 'https://hotelapi-production.up.railway.app/api/password_reset';
    return this.http.post(url, email);
  }

  resetPassword(token: string, password: string ): Observable<any> {
    const resetData = { token, password };
    const apiUrl = 'https://hotelapi-production.up.railway.app/api/password_reset/confirm/?token';

    return this.http.post(apiUrl, resetData);
  }
}



