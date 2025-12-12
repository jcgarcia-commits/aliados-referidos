import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-upsert-solicitud-consulta',
  imports: [],
  templateUrl: './upsert-solicitud_consulta.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertSolicitudConsulta implements OnInit {

  ngOnInit(): void { initFlowbite(); }


  verDocumento() {
  window.open('/mi-documento.pdf', '_blank');
}
}
