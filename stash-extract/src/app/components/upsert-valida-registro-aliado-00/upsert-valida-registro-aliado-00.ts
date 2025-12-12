import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';


import { EmpresaAccordion } from "../empresa-accordion/empresa-accordion";
import { CommonModule } from '@angular/common';

import { UpsertAsignaCuenta } from "../upsert_asigna_cuenta/upsert_asigna_cuenta";
import { GestionRepresentanteAccordion } from '../gestion-representante-accordion/gestion-representante-accordion';

@Component({
  selector: 'app-upsert-valida-registro-aliado-00',
  imports: [EmpresaAccordion, CommonModule, UpsertAsignaCuenta, GestionRepresentanteAccordion],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './upsert-valida-registro-aliado-00.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})



export class UpsertValidaRegistroAliado00 implements OnInit  {

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

  ngOnInit(): void { }

  mostrarPDF() {
    this.iframeVisible = true;
  }

    verDocumento() {
  window.open('/mi-documento.pdf', '_blank');
}

  cerrarContenedor() {
    this.iframeVisible = false;
  }


cerrarContenedorPDF() {
  this.mostrarContenedorPDF = false;
}


/*
  constructor(private sanitizer: DomSanitizer) {}

  transform(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }


    constructor(private sanitizer: DomSanitizer) {}

    mostrarPDF() {
    this.iframeVisible = true;
    this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
      '/mi-documento.pdf'
    );
  }
*/


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

