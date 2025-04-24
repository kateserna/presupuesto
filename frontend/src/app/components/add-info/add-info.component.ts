import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { CardModule } from 'primeng/card';
import { FloatLabel } from "primeng/floatlabel"

interface Opciones {
  name: string;
}
@Component({
  selector: 'app-add-info',
  imports: [
    FormsModule,
    Select,
    CardModule,
    FloatLabel 
  ],
  templateUrl: './add-info.component.html',
  styleUrl: './add-info.component.scss'
})

export class AddInfoComponent implements OnInit {
  //Seccion: Activos, Pasivos, Ingresos, Egresos
  seccion: Opciones[] | undefined;
  tipoSeccion: Opciones | undefined;

  //Categoria Ingresos:
  categActivos: Opciones[] | undefined;
  selectCatActivos: Opciones | undefined;


//crear el resto de categorias por seccion


    ngOnInit() {
        this.seccion = [
            { name: 'Activos' },
            { name: 'Pasivos' },
            { name: 'Ingresos' },
            { name: 'Egresos' },
        ];

        this.categActivos = [
            { name: 'Ingresos' },
            { name: 'Ahorro' },
            { name: 'Negocio' },
            { name: 'Inversión' },
            { name: 'Bienes Raices' },
            { name: 'Otro' },
        ];

        //crear demas categorias por seccion
        
    }

}
