import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
 private isBrowser: boolean;

  constructor() {
    this.isBrowser = typeof window != 'undefined';
  }

  setItem(key: string, value:string): void {
    if(this.isBrowser){
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string): string | null {
    return this.isBrowser ? localStorage.getItem(key) : null;
  }

  removeItem(key: string): void {
    if(this.isBrowser){
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if(this.isBrowser){
      localStorage.clear();
    }
  }

}
