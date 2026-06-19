import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import { renderAsync } from 'docx-preview';
// @ts-ignore
import { Previewer } from 'pagedjs';

@Component({
  selector: 'app-gestion-cartas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './genera-contratos.page.html',
  styles: [`
    :host { display: block; height: 100vh; width: 100vw; overflow: hidden; }
    
    .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #64748b; border-radius: 10px; border: 2px solid #94a3b8; }
    
    .pagedjs-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
      padding: 30px 0;
      background-color: #94a3b8; 
      min-height: 100%;
    }

    ::ng-deep .pagedjs_pages {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
    }

    ::ng-deep .pagedjs_page {
      background-image: url('/fondo-carta-entendimiento.png') !important;
      background-size: 100% 100% !important;
      background-repeat: no-repeat !important;
      background-position: center !important;
      background-color: white !important;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3) !important;
      margin-bottom: 30px !important;
      width: 215.9mm !important;
      height: 279.4mm !important;
      border: none !important;
      position: relative !important;
    }

    ::ng-deep .pagedjs_page_content {
      padding: 0 !important;
      margin: 0 !important;
      background: transparent !important;
    }

    ::ng-deep .docx section {
      padding: 20mm 25mm !important; 
      margin: 0 !important;
      width: 100% !important;
      min-height: 279.4mm !important;
      box-sizing: border-box !important;
      position: relative !important;
      z-index: 1;
      background: transparent !important;
    }

    ::ng-deep .highlight-var {
      color: #2563eb !important;
      background-color: #eff6ff !important;
      font-weight: bold !important;
      padding: 0 2px !important;
      border-radius: 4px !important;
      border: 1px solid #dbeafe !important;
    }

    ::ng-deep .pagedjs_margin-content, ::ng-deep [class*="pagedjs_margin"] { 
      display: none !important; 
    }
  `]
})
export default class GestionCartasPageComponent {
  @ViewChild('renderContainer') renderContainer!: ElementRef;

  public tipoAfiliacion: string = 'Red de referidos';
  public tipoSolicitud: string = '';
  public cargando: boolean = false;
  public showToast: boolean = false;
  public isClosingToast: boolean = false;
  public toastType: string = 'success';
  public camposDetectados: string[] = [];
  public valores: { [key: string]: string } = {};
  private plantillaBuffer: ArrayBuffer | null = null;

  constructor(private cdr: ChangeDetectorRef) {}

  public formatLabel(value: string): string {
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  public onSolicitudManual(event: any): void {
    const value = (event.target as HTMLSelectElement).value;
    if (!value) return;
    this.tipoSolicitud = value;
    let fileToLoad = value === 'registro' ? '/contrato-referidos-fundea.docx' : '/solicitud-cambio-cuenta-bancaria.docx';
    this.cargarYAnalizarPlantilla(fileToLoad);
  }

  private async cargarYAnalizarPlantilla(ruta: string): Promise<void> {
    this.cargando = true;
    try {
      const response = await fetch(ruta);
      this.plantillaBuffer = await response.arrayBuffer();
      const zip = new PizZip(this.plantillaBuffer);
      const doc = new Docxtemplater(zip, { delimiters: { start: '{', end: '}' } });
      const text = doc.getFullText();
      const matches = text.match(/{(.*?)}/g) || [];
      const tags = new Set<string>();
      matches.forEach(match => tags.add(match.replace(/{|}/g, '').trim()));
      this.camposDetectados = Array.from(tags);
      await this.procesarYRenderizar();
    } catch (error) {
      this.lanzarToast('error');
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  public async procesarYRenderizar(): Promise<void> {
    if (!this.plantillaBuffer) return;
    this.cargando = true;
    this.cdr.detectChanges();
    try {
      const zip = new PizZip(this.plantillaBuffer);
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
        nullGetter: (part: any) => this.valores[part.value] ? this.valores[part.value] : `{${part.value}}`
      });
      doc.render(this.valores);
      const out = doc.getZip().generate({ type: 'blob' });
      const tempDiv = document.createElement('div');
      await renderAsync(out, tempDiv, undefined, {
        className: "docx",
        inWrapper: false,
        renderHeaders: false,
        renderDrawing: true,
        experimental: true,
        ignoreWidth: true,
        ignoreHeight: true
      } as any);
      const sections = tempDiv.querySelectorAll('section');
      sections.forEach((sec: any) => {
        sec.style.padding = '0';
        sec.style.margin = '0';
        sec.style.width = '100%';
        sec.style.background = 'transparent';
      });
      this.resaltarVariablesHTML(tempDiv);
      const container = this.renderContainer.nativeElement;
      container.innerHTML = ''; 
      const paged = new Previewer();
      const styleSheet = `@page { size: 215.9mm 279.4mm; margin: 0; }`;
      await paged.preview(tempDiv.innerHTML, [styleSheet], container);
    } catch (error) {
      console.error(error);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  private resaltarVariablesHTML(tempContainer: HTMLElement): void {
    const elements = tempContainer.querySelectorAll('p, td, span, li');
    elements.forEach((el) => {
      if (el.textContent && el.textContent.includes('{')) {
        let html = el.innerHTML;
        const regex = /{(.*?)}/g;
        html = html.replace(regex, (match) => `<span class="highlight-var">${match}</span>`);
        el.innerHTML = html;
      }
    });
  }


  public exportarPDF(): void {
    const printWindow = document.createElement('iframe');
    printWindow.style.position = 'fixed';
    printWindow.style.right = '0';
    printWindow.style.bottom = '0';
    printWindow.style.width = '0';
    printWindow.style.height = '0';
    printWindow.style.border = '0';
    document.body.appendChild(printWindow);

    const doc = printWindow.contentWindow?.document;
    if (!doc) return;


    const styles = Array.from(document.querySelectorAll('style')).map(s => s.innerHTML).join('');
    const content = this.renderContainer.nativeElement.innerHTML;

    doc.write(`
      <html>
        <head>
          <style>
            ${styles}
            @page { size: 215.9mm 279.4mm; margin: 0; }
            body { margin: 0; padding: 0; background: white !important; }
            .pagedjs_pages { width: 215.9mm !important; }
            .pagedjs_page { 
              margin: 0 !important; 
              box-shadow: none !important; 
              page-break-after: always !important; 
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
          </style>
        </head>
        <body>
          <div class="pagedjs-container">${content}</div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.frameElement.remove(); }, 100);
            };
          </script>
        </body>
      </html>
    `);
    doc.close();
    this.lanzarToast('success');
  }

  private lanzarToast(tipo: 'success' | 'error'): void {
    this.toastType = tipo;
    this.showToast = true;
    this.isClosingToast = false;
    this.cdr.detectChanges();
    setTimeout(() => {
      this.isClosingToast = true;
      this.cdr.detectChanges();
      setTimeout(() => { this.showToast = false; this.cdr.detectChanges(); }, 500);
    }, 2500);
  }
}