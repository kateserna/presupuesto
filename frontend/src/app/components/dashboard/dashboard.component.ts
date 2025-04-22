import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ActivosService } from '../../core/services/activos.service';
import { AuthService } from '@auth0/auth0-angular';
import { SharedService } from '../../core/services/shared.service';

interface Transaccion{
  usuario: string;
  fecha_creacion: Date;
  fecha_transaccion: Date;
  tipo: string;
  nombre_categoria: string;
  descripcion?: string; //opcional
  valor: number;
}

interface Activos {
  id: number
  categoria: string
  valor: number
  desripcion: string
  fecha_transaccion: Date
}

@Component({
  selector: 'app-dashboard',
  imports: [SplitterModule, ButtonModule, TableModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit{

  constructor(private sharedService: SharedService, private activosService: ActivosService) {}

  listaActivos = signal<Transaccion[]>([]);
  email: string = ""

  ngOnInit(): void {
    // this.activosService.getAllActivos().subscribe((data: any) => {
    //   this.listaActivos.set(data.message);
    //   console.log(data)
    // });
    this.email = this.sharedService.getEmail() ?? "";
      console.log("correo:",this.email)

    this.activosService.getAllActivosForUsuario(this.email).subscribe((data:any) => {
      this.listaActivos.set(data.message);
      console.log(data)
    })
  }

  //devuelve las transacciones (debe ser activos) de la tabla a traves del servicio
  allActivos = computed(() => {
    return this.listaActivos()
  })


}
