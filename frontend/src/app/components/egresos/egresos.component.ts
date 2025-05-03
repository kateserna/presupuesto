import { Component, computed, OnInit, signal } from '@angular/core';
import { TransaccionService } from '../../core/services/transaccion.service';
import { SharedService } from '../../core/services/shared.service';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
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
  selector: 'app-egresos',
  imports: [
    TableModule,
    CardModule,
    FormsModule,
    DatePicker,
    FloatLabel,
    DecimalPipe, 
    DatePipe,
    ButtonModule,
    ToastModule,
    ConfirmPopupModule 
  ],
  templateUrl: './egresos.component.html',
  styleUrl: './egresos.component.scss',
  providers: [MessageService, ConfirmationService],

})
export class EgresosComponent implements OnInit{
  
  constructor(
    private transaccionService: TransaccionService,
    private sharedService: SharedService,
    private confirmationService: ConfirmationService, 
    private messageService: MessageService
  ) {}

  date = signal(new Date());
  maxDate: Date | undefined;
  email: string = ""
  listaEgresos = signal<Transaccion[]>([]);
  id: number = 0;
  
  ngOnInit(): void {
    this.email = this.sharedService.getEmail() ?? "";
    this.date.set(new Date());
    this.maxDate = new Date();

    this.transaccionService.getAllEgresos(this.email).subscribe( ( data: any ) => {
      this.listaEgresos.set(data.message);
      console.log("egresos: ", data)
    })
  }

  ///actualizar fecha para filtro por mes
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

  //calcular total de egresos por mes
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

  //eliminar transaccion
  deleteEgresos(id: number){
    const result = this.transaccionService.deleteTransaccion(id).subscribe({
      next: (data: any) => {
        console.log("id: ", id)
        console.log("eliminado: ",data)
        this.listaEgresos.set(this.listaEgresos().filter((egresos) => egresos.id !== id));
      },
      error: (err) => {
        console.error("Error al eliminar la transacción: ", err);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al eliminar la transacción.' });
      }
    });
  }

  //confirmar eliminacion de transaccion
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
            this.deleteEgresos(id);
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Transacción eliminada correctamente.', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Ha cancelado la eliminación del registro.', life: 3000 });
        }
    });
  }
  
}
