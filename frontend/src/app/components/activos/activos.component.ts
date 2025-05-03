import { Component, computed, OnInit, signal } from '@angular/core';
import { TransaccionService } from '../../core/services/transaccion.service';
import { SharedService } from '../../core/services/shared.service';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';

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
  selector: 'app-activos',
  imports: [
    TableModule,
    CardModule,
    DecimalPipe, 
    DatePipe,
    ButtonModule,
    ToastModule,
    ConfirmPopupModule
  ],
  templateUrl: './activos.component.html',
  styleUrl: './activos.component.scss',
  providers: [MessageService, ConfirmationService],
})

export class ActivosComponent implements OnInit{

  constructor(
    private transaccionService: TransaccionService,
    private sharedService: SharedService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) {}

  email: string = ""
  listaActivos = signal<Transaccion[]>([]);
  totalActivos = signal(0);
  id: number = 0;

  ngOnInit(): void {

    this.email = this.sharedService.getEmail() ?? "";

    this.transaccionService.getAllActivos(this.email).subscribe((data:any) => {
      this.listaActivos.set(data.message);
      this.totalActivos.set(data.total)
      console.log("activos: ",data)
    })

  }

  //devuelve las transacciones tipo activos de la tabla a traves del servicio
  allActivos = computed(() => {
    console.log("fecha transaccion:", this.listaActivos())
    return this.listaActivos()
  })

  deleteActivos(id: number){
    const result = this.transaccionService.deleteTransaccion(id).subscribe({
      next: (data: any) => {
        console.log("id: ", id)
        console.log("eliminado: ",data)
        this.listaActivos.set(this.listaActivos().filter((activos) => activos.id !== id));
      },
      error: (err) => {
        console.error("Error al eliminar la transacción: ", err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la transacción.' });
      }
    });
  }

  confirmDelete(event: Event, id : number) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: '¿Está seguro que desea eliminar este registro?',
        icon: 'pi pi-exclamation-triangle',
        rejectButtonProps: {
            label: 'Cancelar',
            severity: 'secondary',
            outlined: true
        },
        acceptButtonProps: {
            label: 'Eliminar',
            severity: 'danger'
        },
        accept: () => {
            this.deleteActivos(id);
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Transacción eliminada correctamente.', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Ha cancelado la eliminación del registro.', life: 3000 });
        }
    });
  }

}
