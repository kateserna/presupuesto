import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActivosService {

  private URLBase = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  //obtener todos los activos
  //por ahora son todas las transacciones:
  getAllActivos(){
    return this.http.get(`${this.URLBase}/activos`)
  }
}
