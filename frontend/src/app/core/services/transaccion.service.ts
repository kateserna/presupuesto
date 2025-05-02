import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {

  private URLBase = 'http://localhost:8000';

  constructor(private http: HttpClient) { }

  getAllActivos(email:string){
    return this.http.get(`${this.URLBase}/activos/${email}`)
  }

  getAllPasivos(email:string){
    return this.http.get(`${this.URLBase}/pasivos/${email}`)
  }

  getAllIngresos(email:string){
    return this.http.get(`${this.URLBase}/ingresos/${email}`)
  }

  getAllEgresos(email:string){
    return this.http.get(`${this.URLBase}/egresos/${email}`)
  }

  createTransaccion(transaccion: any){
    return this.http.post(`${this.URLBase}/transacciones`, transaccion);
  }

  deleteTransaccion(id: number){
    return this.http.delete(`${this.URLBase}/transacciones/${id}`);
  }
}
