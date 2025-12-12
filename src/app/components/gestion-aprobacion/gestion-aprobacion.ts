import { ChangeDetectionStrategy, Component, type OnInit, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { LucideAngularModule, SquarePen, Trash2, UserRoundCheck, ScanSearch    } from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { initFlowbite } from 'flowbite';
import { UpsertSolicitudConsulta } from '../upsert-solicitud_consulta/upsert-solicitud_consulta';
import { ValidacionAccordion } from '../validacion-accordion/validacion-accordion';

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
  selector: 'app-gestion-aprobacion',
  imports: [LucideAngularModule, CommonModule, UpsertSolicitudConsulta, ValidacionAccordion],
  templateUrl: './gestion-aprobacion.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GestionAprobacion implements OnInit {

     empresasList = signal<IEmpresa[]>([

        {
      empresaId: '1',
      nombre: 'Red de referidos',
      direccion: 'Afiliación',
      nit: 'Pendiente de aprobación',
      telefono: 'MONETARIA',
      activo: true
    }
  ]);

  readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;
  readonly UserRoundCheck =UserRoundCheck ;
  readonly ScanSearch =ScanSearch ;


  nuevoEmpresa = signal(true)
  empresaEdit = signal<IEmpresa>(emptyEmpresa)

  isLoading = signal(false);
  formKey = signal(Date.now());

  showModal = signal(false);

    modal = signal({
    titulo: 'Crear Solicitud',
    visible: false,
  });

  deleteModalVisible = signal(false);

  buscador = signal('');

  constructor() { }

  ngOnInit(): void {initFlowbite(); }

    ngAfterViewInit() {
  }

    activeModal: string | null = null;
  modal1 = false;
  modal2 = false;
  modal3 = false;
  mostrarContenedor: boolean = false;
  mostrarIframe = false;
  urlDocumento = '/mi-documento.pdf'; // La ruta es desde la raíz del proyecto

  iframeVisible = false;
  pdfUrl: string = '/mi-documento.pdf';

  mostrarContenedorPDF = false;

  mostrarPDF() {
    this.iframeVisible = true;
  }

  cerrarContenedor() {
    this.iframeVisible = false;
  }


cerrarContenedorPDF() {
  this.mostrarContenedorPDF = false;
}


  cerrarIframe() {
  this.iframeVisible = false;
}

  openModal(num: number) {
   if (num === 1) this.modal1 = true;
  if (num === 2) this.modal2 = true;
  if (num === 3) this.modal3 = true;
}

closeModal() {
  this.modal1 = false;
  this.modal2 = false;
  this.modal3 = false;
}
}
