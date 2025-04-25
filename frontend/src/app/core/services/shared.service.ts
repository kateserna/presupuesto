import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class SharedService {
  private email: string | null = null;
  private usuario: string | null = null;

  setEmail(email: string ): void {
    this.email = email;
  }

  setUsuario(usuario: string): void {
    this.usuario = usuario
  }

  getEmail(): string | null {
    return this.email;
  }

  getUsuario(): string | null {
    return this.usuario;
  }
}
