import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PokemonListComponent } from './pokemon-list/pokemon-list.component';

const routes: Routes = [
  { path: 'pokemon-list', component: PokemonListComponent },
  { path: '', redirectTo: 'pokemon-list', pathMatch: 'full' }, // Esta línea redirige a 'pokemon-list' cuando la URL es vacía
  { path: '**', redirectTo: 'pokemon-list' } // Esta línea redirige a 'pokemon-list' si la URL no coincide con ninguna ruta definida
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }