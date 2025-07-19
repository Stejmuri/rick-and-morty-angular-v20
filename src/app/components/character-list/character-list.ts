import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Api } from '../../services/api';
import { Character } from '../../models/character';

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss']
})

export class CharacterListComponent implements OnInit {

  private api = inject(Api); // Inyectar el servicio Api
  public characters = this.api.characters; // Usar la señal de personajes del servicio
  public searchTerm = ''; // Inicializar con un valor vacío
  public loading = false; // Indicador de carga
  public errorMessage = ''; // Mensaje de error inicializado como cadena vacía
  public hasCharacters = computed(() => this.characters().length > 0); // Señal para verificar si hay personajes



  ngOnInit(): void {
    this.loadInitialCharacters();
  }

  loadInitialCharacters(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.getCharacters().subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Error al cargar los personajes';
        console.error('Error al cargar los personajes:', error);
      }
    });
  }


  onSearch(): void {
    this.loading = true;
    this.errorMessage = '';

    this.api.searchCharacters(this.searchTerm).subscribe({
      next: () => {
        this.loading = false;
      },
      error: (error) => {
        this.api.clearCharacters(); // Limpiar la señal de personajes en caso de error
        this.loading = false;
        this.errorMessage = 'Error al buscar personajes';
        console.error('Error al buscar personajes:', error);
      }
    });
  }


  onSearchKeyup(event: Event): void {
    const KeyboardEvent = event as KeyboardEvent;
    if (KeyboardEvent.key === 'Enter') {
      this.onSearch();
    }
  }
}