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
  selector: 'app-pasivos',
  imports: [
    TableModule,
    CardModule,
    DecimalPipe, 
    DatePipe,
    ButtonModule,
    ToastModule,
    ConfirmPopupModule
  ],
  templateUrl: './pasivos.component.html',
  styleUrl: './pasivos.component.scss',
  providers: [MessageService, ConfirmationService],
})

export class PasivosComponent implements OnInit{
  
  constructor(
    private transaccionService: TransaccionService,
    private sharedService: SharedService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) {}

  email: string = ""
  listaPasivos = signal<Transaccion[]>([]);
  totalPasivos = signal(0);
  id: number = 0;

  ngOnInit(): void {
    
    this.email = this.sharedService.getEmail() ?? "";

    this.transaccionService.getAllPasivos(this.email).subscribe( (data: any) => {
      this.listaPasivos.set(data.message);
      this.totalPasivos.set(data.total)
      console.log("pasivos: ", data)
    })

  }

  //devuelve los pasivos de la base de datos a traves del servicio
  allPasivos = computed( () => {
    return this.listaPasivos()
  })

  deletePasivos(id: number){
    const result = this.transaccionService.deleteTransaccion(id).subscribe({
      next: (data: any) => {
        console.log("id: ", id)
        console.log("eliminado: ",data)
        this.listaPasivos.set(this.listaPasivos().filter((pasivos) => pasivos.id !== id));
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
            this.deletePasivos(id);
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Transacción eliminada correctamente.', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Ha cancelado la eliminación del registro.', life: 3000 });
        }
    });
  }
}
