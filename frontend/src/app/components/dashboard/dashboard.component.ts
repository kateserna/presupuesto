import { Component, computed, OnInit, signal } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ActivosService } from '../../core/services/activos.service';
import { SharedService } from '../../core/services/shared.service';
import { PasivosService } from '../../core/services/pasivos.service';
import { IngresosService } from '../../core/services/ingresos.service';
import { EgresosService } from '../../core/services/egresos.service';
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

interface Activos {
  id: number
  categoria: string
  valor: number
  desripcion: string
  fecha_transaccion: Date
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
    private activosService: ActivosService,
    private pasivosService: PasivosService,
    private ingresosService: IngresosService,
    private egresosService: EgresosService
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
  totalIngresos = signal(0);
  totalEgresos = signal(0);

  ngOnInit(): void {

    this.email = this.sharedService.getEmail() ?? "";
    this.date.set(new Date());
    this.maxDate = new Date();

    this.activosService.getAllActivos(this.email).subscribe((data:any) => {
      this.listaActivos.set(data.message);
      this.totalActivos.set(data.total)
      console.log("activos: ",data)
    })

    this.pasivosService.getAllPasivos(this.email).subscribe( (data: any) => {
      this.listaPasivos.set(data.message);
      this.totalPasivos.set(data.total)
      console.log("pasivos: ", data)
    })

    this.ingresosService.getAllIngresos(this.email).subscribe( (data:any) => {
      this.listaIngresos.set(data.menssage);
      this.totalIngresos.set(data.total)
      console.log("ingresos: ", data)
    })

    this.egresosService.getAllEgresos(this.email).subscribe( ( data: any ) => {
      this.listaEgresos.set(data.message);
      this.totalEgresos.set(data.total)
      console.log("egresos: ", data)
    })
  }

  filterMonth(dateMonth: Date){
    this.date.set(dateMonth);
    console.log("Updated date 1:", this.date());
  }

  //devuelve las transacciones tipo activos de la tabla a traves del servicio
  allActivos = computed(() => {
    console.log("fecha transaccion:", this.listaActivos())
    return this.listaActivos()
      .filter(activo => {
      const transactionDate = new Date(activo.fecha_transaccion);
      return transactionDate.getFullYear() === this.date().getFullYear() &&
           transactionDate.getMonth() === this.date().getMonth();
      });
  })

  totalActivos2 = computed( () => {
    return this.listaActivos().reduce((acc, curr) => acc + curr.valor, 0);
    // return this.listaActivos().reduce((total, activo) => {
    //   const transactionDate = new Date(activo.fecha_transaccion);
    //   if (transactionDate.getFullYear() === this.date().getFullYear() &&
    //       transactionDate.getMonth() === this.date().getMonth()) {
    //     return total + activo.valor;
    //   }
    //   return total;
    // }, 0);
  })

  //devuelve los pasivos de la base de datos a traves del servicio
  allPasivos = computed( () => {
    return this.listaPasivos()
      
  })

  //devuelve los ingresos de la base de datos a traves del servicio
  allIngresos = computed( () => {
    return this.listaIngresos()
  })

  //devuelve los egresos de la base de datos a traves del servicio
  allEgresos = computed( () => {
    return this.listaEgresos()
  })
  
  patrimonio = computed( () => this.totalActivos() - this.totalPasivos())
  flujoDeCaja = computed( () => this.totalIngresos() - this.totalEgresos())
}

