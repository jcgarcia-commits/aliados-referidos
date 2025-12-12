import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpsertDatosAliado02 } from '../upsert-datos-aliado-02/upsert-datos-aliado-02';
import { UpsertDatosAliado03 } from '../upsert-datos-aliado-03/upsert-datos-aliado-03';
import { UpsertDomicilios } from '../upsert-domicilios/upsert-domicilios';
import { UpsertContacto } from '../upsert-contacto/upsert-contacto';

@Component({
  selector: 'app-hover-accordion',
  standalone: true,
  imports: [CommonModule, UpsertDatosAliado02, UpsertDatosAliado03, UpsertDomicilios, UpsertContacto],
  templateUrl: './hover-accordion.html',
})
export class HoverAccordion {

  activeSection = signal<'general' | 'laboral' | 'educativa' | 'direcciones' | null>('general');

  onMouseEnter(section: 'general' | 'laboral' | 'educativa' | 'direcciones') {
    this.activeSection.set(section);
  }

  onMouseLeave() {
    // Opcional: descomentar si quieres que se cierre al salir el mouse
    // this.activeSection.set(null);
  }

}
