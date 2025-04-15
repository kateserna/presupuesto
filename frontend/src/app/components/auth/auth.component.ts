import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { AuthService } from '@auth0/auth0-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.scss'
})
export class AuthComponent implements OnInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  //Para verificar si el usuario está autenticado devuelve true o false
  // si devuelve true redirige a la página de dashboard
  // si devuelve false redirige a la página de login
  ngOnInit(): void {
    this. authService.isAuthenticated$.subscribe((isAunthenticated) => {
      if (isAunthenticated){
        this.router.navigate(['/dashboard']);
      }
    })
  }
  
  //ingresar
  login(){
    this.authService.loginWithRedirect();
  }
}