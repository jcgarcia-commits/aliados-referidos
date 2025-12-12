import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-upsert-actividad-comercial',
  imports: [],
  templateUrl: './upsert-actividad-comercial.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertActividadComercial implements OnInit {

  ngOnInit(): void {
     initFlowbite();
   }
   
}
