import { ChangeDetectionStrategy, Component, type OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpsertDatosSolicitud } from '../upsert-datos-solicitud/upsert-datos-solicitud';
import { UpsertExpediente } from '../upsert-expediente/upsert-expediente';


@Component({
  selector: 'app-solicitud-accordion',
  imports: [CommonModule, UpsertDatosSolicitud,UpsertExpediente],
  templateUrl: './solicitud-accordion.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudAccordion implements OnInit {

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
