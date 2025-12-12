import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-upsert-datos-paso2',
  imports: [],
  templateUrl: './upsert-datos-paso2.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertDatosPaso2 implements OnInit {

  ngOnInit(): void { 
    initFlowbite();
  }

}
