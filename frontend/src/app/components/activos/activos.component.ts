import { Component, computed, OnInit, signal } from '@angular/core';
import { ActivosService } from '../../core/services/activos.service';
import { SharedService } from '../../core/services/shared.service';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DecimalPipe, DatePipe } from '@angular/common';

interface Transaccion{
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
    DatePipe 
  ],
  templateUrl: './activos.component.html',
  styleUrl: './activos.component.scss'
})

export class ActivosComponent implements OnInit{

  constructor(
    private activosService: ActivosService,
    private sharedService: SharedService,
  ) {}

  email: string = ""
  listaActivos = signal<Transaccion[]>([]);
  totalActivos = signal(0);

  ngOnInit(): void {

    this.email = this.sharedService.getEmail() ?? "";

    this.activosService.getAllActivos(this.email).subscribe((data:any) => {
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

}
