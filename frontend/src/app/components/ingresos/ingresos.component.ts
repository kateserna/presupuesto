import { Component, computed, OnInit, signal } from '@angular/core';
import { TransaccionService } from '../../core/services/transaccion.service';
import { SharedService } from '../../core/services/shared.service';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
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
    FormsModule,
    DatePicker,
    FloatLabel,
    DecimalPipe, 
    DatePipe 
  ],
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.scss'
})
export class IngresosComponent implements OnInit{

  constructor(
    private transaccionService: TransaccionService,
    private sharedService: SharedService,
    ) {}

    date = signal(new Date());
    maxDate: Date | undefined;
    email: string = ""
    listaIngresos = signal<Transaccion[]>([]);

    ngOnInit(): void {
      this.email = this.sharedService.getEmail() ?? "";
      this.date.set(new Date());
      this.maxDate = new Date();

      this.transaccionService.getAllIngresos(this.email).subscribe( (data:any) => {
        this.listaIngresos.set(data.message);
        console.log("ingresos: ", data)
      })
    }

    filterMonth(dateMonth: Date){
      this.date.set(dateMonth);
      console.log("Updated date 1:", this.date());
    }

    allIngresos = computed( () => {
      console.log("fecha transaccion:", this.listaIngresos())
      return this.listaIngresos()
      //verificar total correcto por mes
        .filter(ingreso => {
          const transactionDate = new Date(ingreso.fecha_transaccion);
          return transactionDate.getFullYear() === this.date().getFullYear() &&
              transactionDate.getMonth() === this.date().getMonth();
          });
    })
    
    totalIngresos = computed( () => {
      return this.listaIngresos().reduce((total, ingreso) => {
        const transactionDate = new Date(ingreso.fecha_transaccion);
        
        if (transactionDate.getFullYear() === this.date().getFullYear() &&
            transactionDate.getMonth() === this.date().getMonth()) {
              
          return total + ingreso.valor;
        }
        return total;
      }, 0);
    })

}
