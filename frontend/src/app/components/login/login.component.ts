import { Component} from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { LoginService } from '../../core/services/login.service';

interface Usuario {
  usurio: string;
  contrasena: string;
}

@Component({
  selector: 'app-login',
  imports: [
    FloatLabelModule, 
    InputTextModule, 
    FormsModule,
    PasswordModule, 
    ButtonModule, 
    CardModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})


export class LoginComponent{

  user = ('');
  password = ('');
 

  constructor(private loginService: LoginService) {}


  setUser(usuario: string) {
    this.user = usuario;
  }

  setPassword(contrasena: string) {
    this.password = contrasena;
  }

  //metodo para limpiar el formulario
  clearForm() {
    this.user = '';
    this.password = '';
  }

  //metodo para iniciar sesion
  authLogin() {
    this.loginService.login(this.user, this.password).subscribe({
      next: (data:any) => {
        console.log(data.message);

        if (data.input === 200) {
          console.log('Inicio de sesión exitoso');
          // Redirigir a la página de inicio o a otra página
          // this.router.navigate(['/home']);
        this.clearForm();
        } else {
          console.error('Error al iniciar sesión: Usuario o contraseña incorrectos 1');
        }
      
      },
      error: (error) => {
        console.error('Error al iniciar sesión: Usuario o contraseña incorrectos 2', error);
      }
    })
    

  }

  
}
