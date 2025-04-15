import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '@auth0/auth0-angular';


@Component({
  selector: 'app-menu',
  imports: [CommonModule, Menubar, AvatarModule, ButtonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent implements OnInit{

  public authService = inject(AuthService);

  items: MenuItem[] | undefined;

  ngOnInit(): void {
    console.log(this.authService); // vemos todo lo que trae el servicio
    this.authService.idTokenClaims$.subscribe(claims => {
      console.log('Token Claims:', claims); // vemos los claims del token
    });

    this.authService.user$.subscribe(user => {
      console.log(user); // vemos los datos del usuario
    });

    this.items = [
      {
          label: 'Home',
          icon: 'pi pi-home'
      },
      {
          label: 'Ingresar información',
          icon: 'pi pi-star'
      },
      {
          label: 'Detalle',
          icon: 'pi pi-search',
          items: [
              {
                  label: 'Activos',
                  icon: 'pi pi-fw pi-plus'
              },
              {
                  label: 'Pasivos',
                  icon: 'pi pi-fw pi-pencil'
              },
              {
                label: 'Ingresos',
                icon: 'pi pi-fw pi-pencil'
              },
              {
                label: 'Egresos',
                icon: 'pi pi-fw pi-pencil'
              }
            ]
      },
      {
          label: 'Resumen',
          icon: 'pi pi-envelope'
      }
    ]
  }

  logout(){
    this.authService.logout();
  }

}
