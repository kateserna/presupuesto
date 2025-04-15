import { Component, inject, OnDestroy, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from "./components/menu/menu.component";

import { AuthService } from '@auth0/auth0-angular';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, MenuComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit, OnDestroy {
  
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();
  isAuthenticated: boolean = false;

  //takeUntil se usa para cancelar la suscripción cuando el componente se destruye
  //esto es útil para evitar fugas de memoria y asegurarse de que no se realicen
  //suscripciones innecesarias después de que el componente haya sido destruido
  //ngOnInit se usa para inicializar el componente y realizar tareas de configuración
  //se actualiza isAuthenticated segun el valor emitido, este se usa para verificar si el usuario está autenticado
  ngOnInit(): void {
    this.authService.isAuthenticated$.pipe(takeUntil(this.destroy$)).subscribe(isAuthenticated => {
      
      this.isAuthenticated = isAuthenticated;
    });
  }

  //ngOnDestroy se usa para limpiar recursos y cancelar suscripciones
  ngOnDestroy(): void {
    this.destroy$.next(); //se usa next para notificar a takeUntil
    this.destroy$.complete();//se usa para limpiar el Subject
  }
}
