import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-upsert-actividad-laboral',
  imports: [],
  templateUrl: './upsert-actividad-laboral.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertActividadLaboral implements OnInit {

  ngOnInit(): void {
     initFlowbite();
   }

}
