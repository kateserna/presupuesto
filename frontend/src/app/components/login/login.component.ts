import { Component } from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

interface Usuario {
  id: number;
  usurio: string;
  contrasena: string;
  correo_electronico: string;
}

@Component({
  selector: 'app-login',
  imports: [
    FloatLabelModule, 
    InputTextModule, 
    FormsModule, 
    ButtonModule, 
    CardModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})


export class LoginComponent {
  user = '';
  password = '';

  
}
