import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EgresosService {

  private URLBase = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getAllEgresos(email:string){
    console.log("email egresos", email)
    return this.http.get(`${this.URLBase}/egresos/${email}`)
  }
}
