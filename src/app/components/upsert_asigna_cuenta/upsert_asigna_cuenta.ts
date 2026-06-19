import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, signal, ViewChild, NgModule , type OnInit} from '@angular/core';
import { LucideAngularModule, SquarePen, Trash2, Newspaper, ReceiptText, FileText , FilePen } from 'lucide-angular';


export interface IEmpresa {
  empresaId?: string;
  nombre: string;
  direccion: string;
  nit: string;
  telefono: string;
  activo: boolean;
}


const emptyEmpresa: IEmpresa = {
  empresaId: '',
  nombre: '',
  direccion: '',
  nit: '',
  telefono: '',
  activo: true,
}
@Component({
  selector: 'app-upsert-asigna-cuenta',
  imports: [LucideAngularModule],
  templateUrl: './upsert_asigna_cuenta.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertAsignaCuenta implements OnInit {

      empresasList = signal<IEmpresa[]>([
    {
      empresaId: '1',
      nombre: 'BANRURAL',
      direccion: '123456789',
      nit: 'ANGELICA CITÁN LÓPEZ',
      telefono: 'MONETARIA',
      activo: true
    },
        {
      empresaId: '1',
      nombre: 'BANCO INDUSTRIAL',
      direccion: '7457678',
      nit: 'ANGELICA PAOLA CITÁN LÓPEZ',
      telefono: 'MONETARIA',
      activo: true
    }
  ]);

    seleccionado: number = 1; // ✔ por defecto la primera fila
  ngOnInit(): void { }


  seleccionar(id: number) {
    this.seleccionado = id; // ✔ solo este queda marcado
  }



}
