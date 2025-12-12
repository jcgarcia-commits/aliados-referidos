import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';

@Component({
  selector: 'app-upsert-valida-registro-alidado-02',
  imports: [],
  templateUrl: './upsert-valida-registro-alidado-02.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertValidaRegistroAlidado02 implements OnInit {

  ngOnInit(): void { 
    initFlowbite();
  }

}
