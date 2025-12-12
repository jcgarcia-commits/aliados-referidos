import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { ListaRepresentantes } from '../lista-representantes/lista-representantes';
import { CommonModule } from '@angular/common'; 


@Component({
  selector: 'app-upsert-representante',
  imports: [ListaRepresentantes, CommonModule],
  templateUrl: './upsert-representante.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertRepresentante implements OnInit {
 modalAbierto = false;


  ngOnInit(): void { }


abrirModal() {
  this.modalAbierto = true;
}

cerrarModal() {
  this.modalAbierto = false;
}
}
