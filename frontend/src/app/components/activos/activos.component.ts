import { Component, computed, OnInit, signal } from '@angular/core';
import { TransaccionService } from '../../core/services/transaccion.service';
import { SharedService } from '../../core/services/shared.service';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';

interface Transaccion{
  id: number;
  usuario: string;
  fecha_creacion: Date;
  fecha_transaccion: Date;
  tipo: string;
  nombre_categoria: string;
  descripcion?: string; //opcional
  valor: number;
}

@Component({
  selector: 'app-activos',
  imports: [
    TableModule,
    CardModule,
    DecimalPipe, 
    DatePipe,
    ButtonModule
  ],
  templateUrl: './activos.component.html',
  styleUrl: './activos.component.scss'
})

export class ActivosComponent implements OnInit{

  constructor(
    private transaccionService: TransaccionService,
    private sharedService: SharedService,
  ) {}

  email: string = ""
  listaActivos = signal<Transaccion[]>([]);
  totalActivos = signal(0);
  id: number = 0;

  ngOnInit(): void {

    this.email = this.sharedService.getEmail() ?? "";

    this.transaccionService.getAllActivos(this.email).subscribe((data:any) => {
      this.listaActivos.set(data.message);
      this.totalActivos.set(data.total)
      console.log("activos: ",data)
    })

  }

  //devuelve las transacciones tipo activos de la tabla a traves del servicio
  allActivos = computed(() => {
    console.log("fecha transaccion:", this.listaActivos())
    //console.log("fecha filtro:", this.date()?.toDateString().split(" ")[1])
    return this.listaActivos()
      //.filter(activos => activos.fecha_transaccion.getMonth() == this.date()?.getMonth())
  })

  deleteActivos(id: number){
    //const index = this.listaActivos().findIndex((activos) => activos.id === id);
    const result = this.transaccionService.deleteTransaccion(id).subscribe({
      next: (data: any) => {
        console.log("id: ", id)
        console.log("eliminado: ",data)
        this.listaActivos.set(this.listaActivos().filter((activos) => activos.id !== id));
        alert("Transacción eliminada correctamente");
      },
      error: (err) => {
        console.error("Error al eliminar la transacción: ", err);
        alert("Error al eliminar la transacción: " + err.error.message);
      }
    });
  }
}
