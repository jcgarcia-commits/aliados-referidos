import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-upsert-datos-aliado-03',
  imports: [],
  templateUrl: './upsert-datos-aliado-03.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertDatosAliado03 implements OnInit {

  ngOnInit(): void { 
    initFlowbite();
  }

}
