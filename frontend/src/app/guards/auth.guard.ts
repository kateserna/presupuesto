import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { map, tap } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Verifica si el usuario está autenticado para proteger las rutas
  // Si no está autenticado, redirige a la página de autenticación
  // Si está autenticado, permite el acceso a la ruta
  return auth.isAuthenticated$.pipe(
    //tap se usa para ejecutar efectos secundarios sin modificar el flujo de datos
    tap(isAuthenticated => {
      if (!isAuthenticated) {
        router.navigate(['/auth']); // Redirige si no está autenticado
      }
    }),
    //map se usa para transformar el valor emitido
    //en este caso, simplemente devuelve el valor de isAuthenticated
    map(isAuthenticated => isAuthenticated)
  );
};