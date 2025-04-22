import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class IngresosService {

  private URLBase = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getAllIngresos(email:string){
    console.log("email ingresos: ", email)
    return this.http.get(`${this.URLBase}/ingresos/${email}`)
  }


}
