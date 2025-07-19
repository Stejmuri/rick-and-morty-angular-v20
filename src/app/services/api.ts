import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Character } from '../models/character';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class Api {
  private readonly API_URL = 'https://rickandmortyapi.com/api/character';
  private readonly http = inject(HttpClient);

  private charactersSignal = signal<Character[]>([]); // Define esto como una señal<Character[]>
  public readonly characters = this.charactersSignal.asReadonly(); // Define esto como una señal de solo lectura

  getCharacters(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(this.API_URL).pipe(
      tap((response: ApiResponse) => {
        this.charactersSignal.set(response.results);
      })
    );
  }

  // Buscar personajes por nombre
  searchCharacters(name: string): Observable<ApiResponse> {
    if (!name.trim()) {
      return this.getCharacters();
    }

    const searchUrl = `${this.API_URL}?name=${encodeURIComponent(name)}`;

    return this.http.get<ApiResponse>(searchUrl).pipe(
      tap((response: ApiResponse) => {
        this.charactersSignal.set(response.results);
      })
    );
  }
  clearCharacters(): void {
    this.charactersSignal.set([]);
  }
}