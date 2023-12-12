import { Component, OnInit } from '@angular/core';
import { PokemonService } from './pokemon.service';

interface Pokemon {
  name: string;
  experience: number;
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
}

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list.component.html',
  styleUrls: ['./pokemon-list.component.css']
})
export class PokemonListComponent implements OnInit {
  pokemonList: Pokemon[] = [];
  displayedPokemonList: Pokemon[] = [];

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getPokemon();
  }

  getPokemon(): void {
    this.pokemonService.getAllPokemon().subscribe(
      (data: any) => {
        this.pokemonList = data.results;

        // Para cada Pokémon en la lista, obtén los detalles individuales
        this.pokemonList.forEach((pokemon: any) => {
          this.pokemonService.getPokemonDetails(pokemon.url).subscribe(
            (details: any) => {
              // Crear un objeto con todos los datos del Pokémon
              const fullPokemonData: Pokemon = {
                name: details.name,
                experience: details.base_experience,
                height: details.height,
                weight: details.weight,
                abilities: details.abilities.map((ability: any) => ({ ability: { name: ability.ability.name } }))
              };
              // Agregar el Pokémon con todos los detalles a la lista
              this.displayedPokemonList.push(fullPokemonData);
            },
            (error) => {
              console.error('Error fetching Pokémon details:', error);
            }
          );
        });
      },
      (error) => {
        console.error('Error fetching Pokémon:', error);
      }
    );
  }

  loadMoreData(event: any): void {
    setTimeout(() => {
      const currentLength = this.displayedPokemonList.length;
      const newData = this.pokemonList.slice(currentLength, currentLength + 10);
  
      newData.forEach((pokemon: any) => {
        this.pokemonService.getPokemonDetails(pokemon.url).subscribe(
          (details: any) => {
            const fullPokemonData: Pokemon = {
              name: details.name,
              experience: details.base_experience,
              height: details.height,
              weight: details.weight,
              abilities: details.abilities.map((ability: any) => ({ ability: { name: ability.ability.name } }))
            };
            this.displayedPokemonList.push(fullPokemonData);
          },
          (error) => {
            console.error('Error fetching Pokémon details:', error);
          }
        );
      });
  
      event.target.complete();
  
      if (this.displayedPokemonList.length === this.pokemonList.length) {
        event.target.disabled = true;
      }
    }, 1000);
  }

  doRefresh(event: any): void {
    // Limpia la lista de Pokémon mostrados antes de cargar nuevos datos
    this.displayedPokemonList = [];

    // Vuelve a obtener los datos (igual que en getPokemon())
    this.getPokemon();

    // Completa el evento de actualización
    setTimeout(() => {
      event.target.complete();
    }, 2000); // Simulando un tiempo de actualización de 2 segundos (ajusta según necesites)
  }
}