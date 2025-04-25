import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivosService {

  private URLBase = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getAllActivos(email:string){
    console.log("email", email)
    return this.http.get(`${this.URLBase}/activos/${email}`)
  }

  createActivos(activo: any){
    return this.http.post(`${this.URLBase}/transacciones`,activo)
  }
}
