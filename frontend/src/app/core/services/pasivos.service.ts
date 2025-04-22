import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PasivosService {
  private URLBase = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getAllPasivos(email:string){
    console.log("emailpasivos:", email)
    return this.http.get(`${this.URLBase}/pasivos/${email}`)
  }
}
