import { Component, computed, OnInit, signal } from '@angular/core';
import { PasivosService } from '../../core/services/pasivos.service';
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
  selector: 'app-pasivos',
  imports: [
    TableModule,
    CardModule,
    DecimalPipe, 
    DatePipe
  ],
  templateUrl: './pasivos.component.html',
  styleUrl: './pasivos.component.scss'
})
export class PasivosComponent implements OnInit{
  constructor(
    private pasivosService: PasivosService,
    private sharedService: SharedService,
  ) {}

  email: string = ""
  listaPasivos = signal<Transaccion[]>([]);
  totalPasivos = signal(0);

  ngOnInit(): void {
    
    this.email = this.sharedService.getEmail() ?? "";

    this.pasivosService.getAllPasivos(this.email).subscribe( (data: any) => {
      this.listaPasivos.set(data.message);
      this.totalPasivos.set(data.total)
      console.log("pasivos: ", data)
    })

  }

  //devuelve los pasivos de la base de datos a traves del servicio
  allPasivos = computed( () => {
    return this.listaPasivos()
      
  })

}
