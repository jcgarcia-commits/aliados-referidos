import { ChangeDetectionStrategy, Component, type OnInit } from '@angular/core';

@Component({
  selector: 'app-upsert-contacto',
  imports: [],
  templateUrl: './upsert-contacto.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertContacto implements OnInit {

  ngOnInit(): void { }

}
