import { ChangeDetectionStrategy, Component, type OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpsertDatosAliado02 } from '../upsert-datos-aliado-02/upsert-datos-aliado-02';
import { UpsertDomicilios } from '../upsert-domicilios/upsert-domicilios';
import { UpsertContacto } from '../upsert-contacto/upsert-contacto';
import { UpsertDocumentosArchivos } from '../upsert-documentos-archivos/upsert-documentos-archivos';
import { UpsertActividadLaboralFinanciera } from '../upsert-actividad-laboral-financiera/upsert-actividad-laboral-financiera';

@Component({
  selector: 'app-gestion-representante-accordion',
  imports: [CommonModule, UpsertDatosAliado02, UpsertDocumentosArchivos, UpsertContacto, UpsertActividadLaboralFinanciera],
  templateUrl: './gestion-representante-accordion.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionRepresentanteAccordion implements OnInit {

  ngOnInit(): void { }


    activeSection = signal<'documentos' | 'datos' | 'contacto' | 'actividad' | null>('documentos');

  onMouseEnter(section: 'documentos' | 'datos' | 'contacto' | 'actividad') {
    this.activeSection.set(section);
  }

  onMouseLeave() {
    // Opcional: descomentar si quieres que se cierre al salir el mouse
    // this.activeSection.set(null);
  }

}
