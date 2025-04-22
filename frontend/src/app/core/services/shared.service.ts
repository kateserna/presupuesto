import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class SharedService {
  private email: string | null = null;

  setEmail(email: string ): void {
    this.email = email;
  }

  getEmail(): string | null {
    return this.email;
  }
}
