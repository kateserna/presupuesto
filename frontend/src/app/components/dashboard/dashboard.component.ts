import { Component, computed, OnInit, signal } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TransaccionService } from '../../core/services/transaccion.service';
import { SharedService } from '../../core/services/shared.service';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { DecimalPipe, DatePipe } from '@angular/common';

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
  selector: 'app-dashboard',
  imports: [
    SplitterModule, 
    ButtonModule, 
    TableModule, 
    FormsModule, 
    DatePicker, 
    FloatLabel,
    DecimalPipe, 
    DatePipe 
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})

export class DashboardComponent implements OnInit{

  constructor(
    private sharedService: SharedService, 
    private transaccionService: TransaccionService,
  ) {}
  
  date = signal(new Date());
  maxDate: Date | undefined;

  email: string = ""
  listaActivos = signal<Transaccion[]>([]);
  listaPasivos = signal<Transaccion[]>([]);
  listaIngresos = signal<Transaccion[]>([]);
  listaEgresos = signal<Transaccion[]>([]);
  totalActivos = signal(0);
  totalPasivos = signal(0);

  ngOnInit(): void {

    this.email = this.sharedService.getEmail() ?? "";
    this.date.set(new Date());
    this.maxDate = new Date();

    this.transaccionService.getAllActivos(this.email).subscribe((data:any) => {
      this.listaActivos.set(data.message);
      // console.log("correo desde el servicio:", this.email);
      // console.log("data activos desde el servicio:", data.message);
      this.totalActivos.set(data.total)
      // console.log("total activos desde el servicio:", this.totalActivos());
    })

    this.transaccionService.getAllPasivos(this.email).subscribe( (data: any) => {
      this.listaPasivos.set(data.message);
      this.totalPasivos.set(data.total)
    })

    this.transaccionService.getAllIngresos(this.email).subscribe( (data:any) => {
      this.listaIngresos.set(data.message);
    })

    this.transaccionService.getAllEgresos(this.email).subscribe( ( data: any ) => {
      this.listaEgresos.set(data.message);
    })
  }

  filterMonth(dateMonth: Date){
    this.date.set(dateMonth);
  }

  //devuelve las transacciones tipo activos de la tabla a traves del servicio
  allActivos = computed(() => {
    console.log("lista activos desde allActivos:", this.listaActivos());
    return this.listaActivos()
  })

  //devuelve los pasivos de la base de datos a traves del servicio
  allPasivos = computed( () => {
    return this.listaPasivos()
  })

  //devuelve los ingresos de la base de datos a traves del servicio
  allIngresos = computed( () => {
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

  //devuelve los egresos de la base de datos a traves del servicio
  allEgresos = computed( () => {
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
  
  //verificar que se de el valor correcto por mes
  flujoDeCaja = computed( () => this.totalIngresos() - this.totalEgresos())
  patrimonio = computed( () => this.totalActivos() - this.totalPasivos())
}

