import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private URLBase = 'http://localhost:8000/';
  private URLLogin = this.URLBase + 'login';

  constructor(private http: HttpClient) { }

  login(loginData: any) {
    // URLSearchParams() ayuda a enviar los datos en el formato correcto
    const body = new URLSearchParams();
    body.set('username', loginData.usuario);
    body.set('password', loginData.contrasena);

    // headers para enviar el tipo de contenido application/x-www-form-urlencoded como formulario encriptado
    const headers = { 
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    // el metodo post envia los datos al servidor con el parametro body en texto plano
    // el metodo post devuelve un observable
    // el observable se puede subscribir para obtener la respuesta del servidor   
    return this.http.post(this.URLLogin, body.toString(), { headers });
  }
}
