import { ChangeDetectionStrategy, Component, type OnInit, signal } from '@angular/core';

import { CommonModule } from '@angular/common';
import { UpsertEmpresa } from '../upsert-empresa/upsert-empresa';
import { UpsertRepresentante } from '../upsert-representante/upsert-representante';
import { UpsertActividadComercial } from '../upsert-actividad-comercial/upsert-actividad-comercial';


@Component({
  selector: 'app-empresa-accordion',
  imports: [CommonModule, UpsertEmpresa, UpsertActividadComercial, UpsertRepresentante],
  templateUrl: './empresa-accordion.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmpresaAccordion  {

    activeSection = signal<'general' | 'laboral' | 'educativa' | 'direcciones' | null>('general');

  onMouseEnter(section: 'general' | 'laboral' | 'educativa' | 'direcciones') {
    this.activeSection.set(section);
  }

  onMouseLeave() {
    // Opcional: descomentar si quieres que se cierre al salir el mouse
    // this.activeSection.set(null);
  }

}
