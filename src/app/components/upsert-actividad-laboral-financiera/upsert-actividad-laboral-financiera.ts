import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-upsert-actividad-laboral-financiera',
  imports: [],
  templateUrl: './upsert-actividad-laboral-financiera.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertActividadLaboralFinanciera implements OnInit {

  ngOnInit(): void {
     initFlowbite();
   }


}
