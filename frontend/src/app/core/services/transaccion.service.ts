import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TransaccionService {

  private URLBase = 'https://b277-18-223-99-46.ngrok-free.app/api';//'http://ec2-18-223-99-46.us-east-2.compute.amazonaws.com:8000/api'

  //http://localhost:8000
  
  constructor(private http: HttpClient) { }

  getAllActivos(email: string) {
    const headers = new HttpHeaders({
      'ngrok-skip-browser-warning': 'true'
    });

    return this.http.get(`${this.URLBase}/activos/${email}`, { headers });
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
