import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ActivosService } from '../../core/services/activos.service';
import { AuthService } from '@auth0/auth0-angular';
import { SharedService } from '../../core/services/shared.service';
import { PasivosService } from '../../core/services/pasivos.service';
import { IngresosService } from '../../core/services/ingresos.service';
import { EgresosService } from '../../core/services/egresos.service';

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

  constructor(
    private sharedService: SharedService, 
    private activosService: ActivosService,
    private pasivosService: PasivosService,
    private ingresosService: IngresosService,
    private egresosService: EgresosService
  ) {}

  email: string = ""
  listaActivos = signal<Transaccion[]>([]);
  listaPasivos = signal<Transaccion[]>([]);
  listaIngresos = signal<Transaccion[]>([]);
  listaEgresos = signal<Transaccion[]>([]);

  ngOnInit(): void {
    // this.activosService.getAllActivos().subscribe((data: any) => {
    //   this.listaActivos.set(data.message);
    //   console.log(data)
    // });
    this.email = this.sharedService.getEmail() ?? "";

    this.activosService.getAllActivosForUsuario(this.email).subscribe((data:any) => {
      this.listaActivos.set(data.message);
      console.log("activos: ",data)
    })

    this.pasivosService.getAllPasivos(this.email).subscribe( (data: any) => {
      this.listaPasivos.set(data.message);
      console.log("pasivos: ", data)
    })

    this.ingresosService.getAllIngresos(this.email).subscribe( (data:any) => {
      this.listaIngresos.set(data.menssage);
      console.log("ingresos: ", data)
    })
  }

  //devuelve las transacciones tipo activos de la tabla a traves del servicio
  allActivos = computed(() => {
    return this.listaActivos()
  })

  totalActivos = (0);

  //devuelve los pasivos de la base de datos a traves del servicio
  allPasivos = computed( () => {
    return this.listaPasivos()
  })

  totalPatrimonio = computed( () => {
    this.totalActivos = this.listaActivos().reduce( (acc, curr) => acc + curr.valor, 0);
    return this.totalActivos
  })

  allIngresos = computed( () => {
    return this.listaIngresos()
  })




}
