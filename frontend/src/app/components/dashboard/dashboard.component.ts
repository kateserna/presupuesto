import { Component, computed, OnInit, signal } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { ActivosService } from '../../core/services/activos.service';

interface Transaccion{
  usuario: string;
  fecha_creacion: Date;
  fecha_transaccion: Date;
  tipo: string;
  nombre_categoria: string;
  descripcion: string; //opcional
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

  listaActivos = signal<Transaccion[]>([]);
  
  constructor(private activosService: ActivosService){}

  ngOnInit(): void {
    this.activosService.getAllActivos().subscribe((data: any) => {
      this.listaActivos.set(data);
    });
  }

  //devuelve las transacciones (debe ser activos) de la tabla a traves del servicio
  allActivos = computed(() => {
    console.log(this.listaActivos)
    return this.listaActivos()
    
  })


}
