import { ChangeDetectionStrategy, Component, type OnInit, signal  } from '@angular/core';

import { CommonModule } from '@angular/common';
import { UpsertValidaRegistroAliado01 } from '../upsert-valida-registro-aliado-01/upsert-valida-registro-aliado-01';
import { UpsertValidaRegistroAlidado02 } from '../upsert-valida-registro-alidado-02/upsert-valida-registro-alidado-02';
import { UpsertValidaRegistroAlidado03 } from '../upsert-valida-registro-alidado-03/upsert-valida-registro-alidado-03';
import { UpsertValidaRegistroAliado00 } from '../upsert-valida-registro-aliado-00/upsert-valida-registro-aliado-00';

@Component({
  selector: 'app-validacion-accordion',
  imports: [UpsertValidaRegistroAlidado02, UpsertValidaRegistroAlidado03, UpsertValidaRegistroAliado00, CommonModule],
  templateUrl: './validacion-accordion.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidacionAccordion implements OnInit {


  ngOnInit(): void { }

      activeSection = signal<'general' | 'laboral' | 'educativa' | 'direcciones' | null>('general');

  onMouseEnter(section: 'general' | 'laboral' | 'educativa' | 'direcciones') {
    this.activeSection.set(section);
  }

  onMouseLeave() {
    // Opcional: descomentar si quieres que se cierre al salir el mouse
    // this.activeSection.set(null);
  }


}
