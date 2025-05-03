import { Component, OnInit, signal } from '@angular/core';
import { SharedService } from '../../core/services/shared.service';
import { TransaccionService } from '../../core/services/transaccion.service';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { FloatLabel } from "primeng/floatlabel"
import { InputNumber } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { DatePickerModule } from 'primeng/datepicker';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

interface Opciones {
  name: string;
}

interface Transaccion{
  id: number;
  usuario: string
  correo_electronico: string;
  fecha_transaccion: Date;
  tipo: string;
  nombre_categoria: string;
  descripcion?: string; //opcional
  valor: number;
}

@Component({
  selector: 'app-add-info',
  imports: [
    FormsModule,
    Select,
    CardModule,
    FloatLabel,
    InputNumber,
    InputTextModule,
    DatePickerModule,
    ButtonModule, 
    CommonModule,
    Toast,
  ],
  templateUrl: './add-info.component.html',
  styleUrl: './add-info.component.scss',
  providers: [MessageService],
})

export class AddInfoComponent implements OnInit {
  constructor(
      private sharedService: SharedService, 
      private transaccionService: TransaccionService,
      private messageService: MessageService
    ) {}

  email: string = ""
  usuario: string = ""
  listaActivos = signal<Transaccion[]>([]);
  listaPasivos = signal<Transaccion[]>([]);
  listaIngresos = signal<Transaccion[]>([]);
  listaEgresos = signal<Transaccion[]>([]);

  dateTransaccion: Date | undefined;
  maxDate: Date | undefined;

  //Seccion: Activos, Pasivos, Ingresos, Egresos
  seccion: Opciones[] | undefined;
  tipoSeccion: Opciones | undefined;

  //Listados de categorias:
  categActivos: Opciones[] | undefined;
  selectCatActivos: Opciones | undefined;

  categPasivos: Opciones[] | undefined;
  selectCatPasivos: Opciones | undefined;

  categIngresos: Opciones[] | undefined;
  selectCatIngresos: Opciones | undefined;

  categEgresos: Opciones[] | undefined;
  selectCatEgresos: Opciones | undefined;

  valor: number | undefined;
  descripcion = ('');
  valorError: boolean = false; // Track validation error for 'valor'

  ngOnInit() {

    this.email = this.sharedService.getEmail() ?? "";
    this.usuario = this.sharedService.getUsuario() ?? "";
    this.dateTransaccion = new Date();
    this.maxDate = new Date();

    //opciones de seccion:
    this.seccion = [
      { name: 'activos' },
      { name: 'pasivos' },
      { name: 'ingresos' },
      { name: 'egresos' },
    ];

    //opciones de categorias:
    this.categActivos = [
      { name: 'ingresos' },
      { name: 'ahorro' },
      { name: 'negocio' },
      { name: 'inversión' },
      { name: 'bienes raíces' },
      { name: 'otro' },
    ];

    this.categPasivos = [
      { name: 'tarjeta de crédito' },
      { name: 'carro' },
      { name: 'préstamo bancario' },
      { name: 'hipoteca de la casa' },
      { name: 'hipoteca de bienes raíces' },
      { name: 'obligaciones de negocios' },
      { name: 'inversiones' },
      { name: 'gastos básicos' },
      { name: 'otro' },
    ];

    this.categIngresos = [
      { name: 'salario' },
      { name: 'cdt' },
      { name: 'dividendos' },
      { name: 'bienes raíces' },
      { name: 'negocios' },
      { name: 'otro' },
    ];

    this.categEgresos = [
      { name: 'servicios públicos' },
      { name: 'tarjeta de crédito' },
      { name: 'salud' },
      { name: 'alimentación' },
      { name: 'arriendo' },
      { name: 'carro o transporte' },
      { name: 'varios' },
      { name: 'personal' },
      { name: 'entretenimiento' },
      { name: 'mascotas' },
      { name: 'inversion / negocio' },
      { name: 'otro' },
    ];

  }

  showError(mensaje: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: mensaje });
  }

  //revisar metdo fecha si este dando
  setDateTransaccion(dateTransaccion: Date){
    this.dateTransaccion = dateTransaccion;
    console.log("fecha transaccion: ", this.dateTransaccion)

  }

  setTipoSeccion(tipoSeccion: Opciones){
    //this.tipoSeccion = tipoSeccion;
    this.tipoSeccion = tipoSeccion;
    console.log("tipo: ", this.tipoSeccion)
  }

  setSelectCategActivos(selectCatActivos: Opciones){
    this.selectCatActivos = selectCatActivos
    console.log("categoria activo: ", this.selectCatActivos)
  }

  setSelectCategPasivos(selectCatPasivos: Opciones){
    this.selectCatPasivos = selectCatPasivos
    console.log("categoria activo: ", this.selectCatPasivos)
  }

  setSelectCategIngresos(selectCatIngresos: Opciones){
    this.selectCatIngresos = selectCatIngresos
    console.log("categoria activo: ", this.selectCatIngresos)
  }

  setSelectCategEgresos(selectCatEgresos: Opciones){
    this.selectCatEgresos = selectCatEgresos
    console.log("categoria activo: ", this.selectCatEgresos)
  }

  setValor(valor:number){
    if(valor <= 0){
      this.showError("El valor no puede ser negativo o cero");
      return;
    }
    this.valor = valor;
    console.log("valor: ", this.valor);
  }

  setDescrpcion(descripcion:string){
    this.descripcion = descripcion;
    console.log("descripción: ", this.descripcion)
  }

  //metodo para limpiar el formulario
  clearForm(){
    this.dateTransaccion = undefined;
    this.tipoSeccion = undefined;
    this.selectCatActivos = undefined;
    this.valor = undefined;
    this.descripcion = '';
  }

  //metodo para crear registro:
  addTransaccion(){
    if(this.dateTransaccion === undefined){
      this.showError("No ha seleccionado una fecha");
      return;
    }
    
    let categoria = '';
    if(this.tipoSeccion?.name === "activos"){
      categoria = this.selectCatActivos?.name ?? ''
      if(this.selectCatActivos?.name === undefined){
        this.showError("No ha seleccionado una categoría");
        return;
      }
    }else if(this.tipoSeccion?.name === "pasivos"){
      categoria = this.selectCatPasivos?.name ?? ''
      if(this.selectCatPasivos?.name === undefined){
        this.showError("No ha seleccionado una categoría");
        return;
      }
    }else if(this.tipoSeccion?.name === "ingresos"){
      categoria = this.selectCatIngresos?.name ?? ''
      if(this.selectCatIngresos?.name === undefined){
        this.showError("No ha seleccionado una categoría");
        return;
      }
    }else if(this.tipoSeccion?.name === "egresos"){
      categoria = this.selectCatEgresos?.name ?? ''
      if(this.selectCatEgresos?.name === undefined){
        this.showError("No ha seleccionado una categoría");
        return;
      } 
    }else{
      this.showError("No ha seleccionado una sección");
      return; 
    }
    
    if(this.valor === undefined || this.valor <= 0){
      this.showError("El valor no puede ser negativo o cero");
      return;
    }

    const newTransaccion: Transaccion ={
      id: 0,
      usuario: this.usuario,
      correo_electronico: this.email,
      fecha_transaccion: this.dateTransaccion ?? new Date(),
      tipo: this.tipoSeccion?.name ?? '',
      nombre_categoria: categoria,
      descripcion: this.descripcion, //opcional
      valor: this.valor ?? 0

    };

    //verificacion del resultado de la petición
    const result = this.transaccionService.createTransaccion(newTransaccion).subscribe({
      next: (data: any) => {
        this.listaActivos.update((historial:Transaccion[]) => {
          console.log("Nuevo registro:", newTransaccion)
          return [...historial, newTransaccion];
        }
      );
      this.messageService.add({ severity: 'success', summary: '¡Felicidades!', detail: "Registro creado correctamente" });
      this.clearForm();
      },
      error: (err: any) => {
        this.showError("Error al crear el registro.");
      }
      
    });
  }

}
