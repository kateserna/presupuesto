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
  selector: 'app-ingresos',
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
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.scss',
  providers: [MessageService, ConfirmationService],

})
export class IngresosComponent implements OnInit{

  constructor(
  private transaccionService: TransaccionService,
  private sharedService: SharedService,
  private confirmationService: ConfirmationService, 
  private messageService: MessageService
  ) {}

  date = signal(new Date());
  maxDate: Date | undefined;
  email: string = ""
  listaIngresos = signal<Transaccion[]>([]);
  id: number = 0;


  ngOnInit(): void {

    this.email = this.sharedService.getEmail() ?? "";
    this.date.set(new Date());
    this.maxDate = new Date();

    this.transaccionService.getAllIngresos(this.email).subscribe( (data:any) => {
      this.listaIngresos.set(data.message);
      console.log("ingresos: ", data)
    })
  }
  //actualizar fecha para filtro por mes
  filterMonth(dateMonth: Date){
    this.date.set(dateMonth);
    console.log("Updated date 1:", this.date());
  }

  allIngresos = computed( () => {
    console.log("fecha transaccion:", this.listaIngresos())
    return this.listaIngresos()
    //verificar total correcto por mes
      .filter(ingreso => {
        const transactionDate = new Date(ingreso.fecha_transaccion);
        return transactionDate.getFullYear() === this.date().getFullYear() &&
            transactionDate.getMonth() === this.date().getMonth();
        });
  })
   
  //calcular total de ingresos por mes
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

  //eliminar transaccion
  deleteIngresos(id: number){
    const result = this.transaccionService.deleteTransaccion(id).subscribe({
      next: (data: any) => {
        console.log("id: ", id)
        console.log("eliminado: ",data)
        this.listaIngresos.set(this.listaIngresos().filter((ingresos) => ingresos.id !== id));
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
            this.deleteIngresos(id);
            this.messageService.add({ severity: 'success', summary: 'Confirmado', detail: 'Transacción eliminada correctamente.', life: 3000 });
        },
        reject: () => {
            this.messageService.add({ severity: 'error', summary: 'Rechazado', detail: 'Ha cancelado la eliminación del registro.', life: 3000 });
        }
    });
  }


}
