import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// @ts-ignore
import { Previewer } from 'pagedjs';
// @ts-ignore
import html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-gestion-cartas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carta-entendimiento.page.html',
  styles: [`
    :host { display: block; height: 100vh; width: 100vw; overflow: hidden; }
    
    .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #64748b; border-radius: 10px; border: 2px solid #94a3b8; }
    
    .pagedjs-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      min-width: 100%;
      padding: 40px 0;
    }

    ::ng-deep .pagedjs_pages {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      width: fit-content !important;
    }

    ::ng-deep .pagedjs_page {
      background: white !important;
      box-shadow: 0 10px 40px rgba(0,0,0,0.3) !important;
      margin-bottom: 30px !important;
      flex-shrink: 0 !important;
      min-width: 215.9mm !important;

      /* Asegura que el fondo se vea en la previsualización */
      background-image: url('/fondo-carta-entendimiento.png') !important;
      background-position: center !important;
      background-repeat: no-repeat !important;
      background-size: contain !important;
    }

    /* Animaciones Toast */
    .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
    .animate-fade-out { animation: fadeOut 0.5s ease-in forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes fadeOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(-10px); } }
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
  
  public htmlMaster: string = '';
  private estilosMaster: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  public formatLabel(value: string): string {
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  public onSolicitudManual(event: any): void {
    const value = event.target.value;
    if (!value) return;
    this.tipoSolicitud = value;
    let fileToLoad = value === 'registro' ? '/carta-de-entendimiento.html' : '/cambio-cuenta-bancaria.html';
    this.cargarYDetectar(fileToLoad);
  }

  private async cargarYDetectar(ruta: string): Promise<void> {
    this.cargando = true;
    this.cdr.detectChanges();
    try {
      const response = await fetch(ruta);
      const fullHtml = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(fullHtml, 'text/html');
      this.estilosMaster = Array.from(doc.querySelectorAll('style')).map(s => s.innerHTML);
      const pageContents = Array.from(doc.querySelectorAll('.content-area'));
      this.htmlMaster = pageContents.length > 0 
        ? pageContents.map(pc => pc.innerHTML).join('<div style="page-break-after: always;"></div>')
        : doc.body.innerHTML;
      const regex = /\{([^}]+)\}/g;
      let match;
      const encontrados = new Set<string>();
      while ((match = regex.exec(this.htmlMaster)) !== null) encontrados.add(match[1]);
      this.camposDetectados = Array.from(encontrados);
      this.camposDetectados.forEach(campo => { if (this.valores[campo] === undefined) this.valores[campo] = ''; });
      await this.procesarYRenderizar();
    } catch (error) { console.error(error); } 
    finally { this.cargando = false; this.cdr.detectChanges(); }
  }

  public async procesarYRenderizar(): Promise<void> {
    if (!this.htmlMaster) return;
    this.cargando = true;
    this.cdr.detectChanges();
    try {
      let htmlSustituido = this.htmlMaster;
      for (const campo of this.camposDetectados) {
        const token = `{${campo}}`;
        htmlSustituido = htmlSustituido.split(token).join(this.valores[campo] || token);
      }

    
      const htmlConEspacio = `<div style="height: 20mm; width: 100%;"></div>` + htmlSustituido;

      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlConEspacio;

      tempDiv.querySelectorAll('*').forEach((el: any) => {
      
        el.style.position = 'relative'; 
        el.style.top = 'auto';
        el.style.width = 'auto'; 
        el.style.minHeight = 'auto'; 
        el.style.padding = '0';
        if (el.tagName === 'P') { el.style.display = 'block'; el.style.marginBottom = '12pt'; }
      });

      const container = this.renderContainer.nativeElement;
      container.innerHTML = ''; 

      const baseStyle = `
        @page { 
          size: 215.9mm 279.4mm; 
          margin: 25.4mm !important; 
          
          background-image: url('/fondo-carta-entendimiento.png');
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
        }

        .pagedjs_page_content {
          display: block !important;
          background: transparent !important;
        }

        body { 
          font-family: 'Calibri', sans-serif !important;
          font-size: 11pt !important;
          line-height: 1.5 !important;
        }

        p {
          display: block !important;
          margin-bottom: 12pt !important;
          text-align: justify !important;
        }

        span { 
          display: inline !important; 
          white-space: normal !important; 
        }

        .pagedjs_page {
          --pagedjs-margin-top: 0px !important;
          --pagedjs-margin-right: 0px !important;
          --pagedjs-margin-bottom: 0px !important;
          --pagedjs-margin-left: 0px !important;
          background: white !important; 
        }
      `;

      const paged = new Previewer();
      await paged.preview(tempDiv.innerHTML, [...this.estilosMaster, baseStyle], container);
    } finally { this.cargando = false; this.cdr.detectChanges(); }
  }

  public async exportarPDF(): Promise<void> {
    this.cargando = true;
    this.cdr.detectChanges();
    const element = this.renderContainer.nativeElement.querySelector('.pagedjs_pages');
    if (!element) { this.cargando = false; return; }

    const opt = {
      margin: 0,
      filename: `documento-${this.tipoSolicitud}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, logging: false },
      jsPDF: { unit: 'mm' as const, format: 'letter' as const, orientation: 'portrait' as const }
    };

    try {
      await html2pdf().set(opt).from(element).save();
      this.toastType = 'success';
      this.showToast = true;
      this.isClosingToast = false;
      this.cdr.detectChanges();
      setTimeout(() => {
        this.isClosingToast = true;
        this.cdr.detectChanges();
        setTimeout(() => { this.showToast = false; this.cdr.detectChanges(); }, 500);
      }, 2500);
    } catch (error) { console.error(error); } 
    finally { this.cargando = false; this.cdr.detectChanges(); }
  }
}