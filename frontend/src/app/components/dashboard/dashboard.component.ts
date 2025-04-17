import { Component, signal } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

interface Transaccion{
  usuario: string;
  fecha_creacion: Date;
  fecha_transaccion: Date;
  tipo: string;
  nombre_categoria: string;
  descripcion: string; //opcional
  valor: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [SplitterModule, ButtonModule, TableModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

  listaActivos = signal<Transaccion[]>([]);
  


}
