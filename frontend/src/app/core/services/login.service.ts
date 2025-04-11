import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private URLBase = 'http://localhost:8000/';
  private URLLogin = this.URLBase + 'login';

  constructor(private http: HttpClient) { }

  login(usuario: string, contrasena: string) {
    const body = {
      usuario: usuario,
      contrasena: contrasena
    };
    return this.http.post(this.URLLogin, body);
  }

}
