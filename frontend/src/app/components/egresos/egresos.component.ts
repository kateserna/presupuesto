import { Component, computed, OnInit, signal } from '@angular/core';
import { EgresosService } from '../../core/services/egresos.service';
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
  selector: 'app-egresos',
  imports: [
    TableModule,
    CardModule,
    DecimalPipe, 
    DatePipe 
  ],
  templateUrl: './egresos.component.html',
  styleUrl: './egresos.component.scss'
})
export class EgresosComponent implements OnInit{
  
  constructor(
    private egresosService: EgresosService,
    private sharedService: SharedService,
  ) {}

  email: string = ""
  listaEgresos = signal<Transaccion[]>([]);
  totalEgresos = signal(0);
  
  ngOnInit(): void {
    this.email = this.sharedService.getEmail() ?? "";
    
    this.egresosService.getAllEgresos(this.email).subscribe( ( data: any ) => {
      this.listaEgresos.set(data.message);
      this.totalEgresos.set(data.total)
      console.log("egresos: ", data)
    })
  }

  allEgresos = computed( () => {
    return this.listaEgresos()
  })
  
}
