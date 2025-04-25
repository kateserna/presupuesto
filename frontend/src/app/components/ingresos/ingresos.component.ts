import { Component, computed, OnInit, signal } from '@angular/core';
import { IngresosService } from '../../core/services/ingresos.service';
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
  selector: 'app-ingresos',
  imports: [
    TableModule,
    CardModule,
    DecimalPipe, 
    DatePipe 
  ],
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.scss'
})
export class IngresosComponent implements OnInit{

  constructor(
    private ingresosService: IngresosService,
      private sharedService: SharedService,
    ) {}

    email: string = ""
    listaIngresos = signal<Transaccion[]>([]);
    totalIngresos = signal(0);

    ngOnInit(): void {
      this.email = this.sharedService.getEmail() ?? "";

      this.ingresosService.getAllIngresos(this.email).subscribe( (data:any) => {
        this.listaIngresos.set(data.menssage);
        this.totalIngresos.set(data.total)
        console.log("ingresos: ", data)
      })
    }

    allIngresos = computed( () => {
      return this.listaIngresos()
    })    

}
