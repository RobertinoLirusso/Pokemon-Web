import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
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
  pokemonList: any[] = [];
  displayedPokemonList: Pokemon[] = [];
  offset = 0;
  limit = 10;
  @ViewChild(IonContent) content!: IonContent;

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.getPokemon();
  }

  getPokemon(): void {
    this.pokemonService.getAllPokemon().subscribe(
      (data: any) => {
        this.pokemonList = data.results.slice(0, this.limit);
        this.offset = this.limit;
        this.loadPokemonDetails(this.pokemonList);
      },
      (error) => {
        console.error('Error fetching Pokémon:', error);
      }
    );
  }

  loadMoreData(event: any): void {
    this.pokemonService.getAllPokemon().subscribe(
      (data: any) => {
        const additionalPokemon = data.results.slice(this.offset, this.offset + this.limit);
        this.offset += this.limit;

        if (additionalPokemon.length === 0) {
          event.target.disabled = true;
        }

        this.loadPokemonDetails(additionalPokemon);
        event.target.complete();
      },
      (error) => {
        console.error('Error fetching additional Pokémon:', error);
        event.target.complete();
      }
    );
  }

  loadPokemonDetails(pokemonArray: any[]): void {
    pokemonArray.forEach((pokemon: any) => {
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
  }
  
  doRefresh(event: any): void {
    this.displayedPokemonList = [];
    this.getPokemon();
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }

  scrollToTop() {
    this.content.scrollToTop(1500);
  }
}