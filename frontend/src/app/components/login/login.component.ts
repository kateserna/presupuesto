import { Component} from '@angular/core';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { LoginService } from '../../core/services/login.service';

interface Usuario {
  usuario: string;
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
    const loginData: Usuario = {
      usuario: this.user,
      contrasena: this.password
    };
    this.loginService.login(loginData).subscribe({
      next: (data:any) => {
        if (data.status === 200) {
          this.loginService.guardarToken(data.access_token);
          this.clearForm();
          // Redirigir a la página de inicio o a otra página
          //this.router.navigate(['/dashboard']);
        }
        alert(data.message);
      },
      error: (error) => {
        alert("Login failed");
      }
    })
  }
}
