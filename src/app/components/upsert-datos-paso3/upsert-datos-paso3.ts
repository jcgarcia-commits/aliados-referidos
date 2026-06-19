import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-upsert-datos-paso3',
  imports: [],
  templateUrl: './upsert-datos-paso3.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertDatosPaso3 implements OnInit {

  ngOnInit(): void { 
    initFlowbite();
  }

}
