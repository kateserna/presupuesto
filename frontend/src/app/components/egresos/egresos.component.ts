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
  selector: 'app-egresos',
  imports: [
    TableModule,
    CardModule,
    FormsModule,
    DatePicker,
    FloatLabel,
    DecimalPipe, 
    DatePipe 
  ],
  templateUrl: './egresos.component.html',
  styleUrl: './egresos.component.scss'
})
export class EgresosComponent implements OnInit{
  
  constructor(
    private transaccionService: TransaccionService,
    private sharedService: SharedService,
  ) {}

  date = signal(new Date());
  maxDate: Date | undefined;
  email: string = ""
  listaEgresos = signal<Transaccion[]>([]);
  
  ngOnInit(): void {
    this.email = this.sharedService.getEmail() ?? "";
    this.date.set(new Date());
    this.maxDate = new Date();

    this.transaccionService.getAllEgresos(this.email).subscribe( ( data: any ) => {
      this.listaEgresos.set(data.message);
      console.log("egresos: ", data)
    })
  }

  filterMonth(dateMonth: Date){
    this.date.set(dateMonth);
    console.log("Updated date 1:", this.date());
  }

  allEgresos = computed( () => {
    console.log("fecha transaccion:", this.listaEgresos())
    return this.listaEgresos()
    //verificar total correcto por mes
      .filter(egresos => {
        const transactionDate = new Date(egresos.fecha_transaccion);
        return transactionDate.getFullYear() === this.date().getFullYear() &&
            transactionDate.getMonth() === this.date().getMonth();
        });
  })

  totalEgresos = computed( () => {
    return this.listaEgresos().reduce((total, egresos) => {
      const transactionDate = new Date(egresos.fecha_transaccion);
      
      if (transactionDate.getFullYear() === this.date().getFullYear() &&
          transactionDate.getMonth() === this.date().getMonth()) {
            
        return total + egresos.valor;
      }
      return total;
    }, 0);
  })
  
}
