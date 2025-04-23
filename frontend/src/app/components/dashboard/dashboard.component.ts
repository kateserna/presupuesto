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
  
  date = signal<Date | undefined>(undefined);


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

  // Actualizacion de filtro fecha
  updateDate(newDate: Date) {
    const datePipe = new DatePipe('MM/yyyy');
    this.date.set(newDate);
    const dateMonth = datePipe.transform(this.date(), 'MM/yyyy')
    console.log("Updated date 1:", this.date());
    console.log("date transform:", dateMonth);

  }

  //devuelve las transacciones tipo activos de la tabla a traves del servicio
  allActivos = computed(() => {
    console.log("fecha transaccion:", this.listaActivos())
    console.log("fecha filtro:", this.date()?.toDateString().split(" ")[1])
    return this.listaActivos()
      //.filter(activos => activos.fecha_transaccion.getMonth() == this.date()?.getMonth())
      

  })

  //devuelve los pasivos de la base de datos a traves del servicio
  allPasivos = computed( () => {
    return this.listaPasivos()
      
  })

    allIngresos = computed( () => {
    return this.listaIngresos()
  })

  allEgresos = computed( () => {
    return this.listaEgresos()
  })
  
  patrimonio = computed( () => this.totalActivos() - this.totalPasivos())
  flujoDeCaja = computed( () => this.totalIngresos() - this.totalEgresos())
}

