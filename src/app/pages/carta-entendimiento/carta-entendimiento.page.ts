import { Component, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
// @ts-ignore
import { Previewer } from 'pagedjs';

@Component({
  selector: 'app-gestion-cartas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carta-entendimiento.page.html',
  styles: [`
    :host { 
      display: block; 
      height: 100vh; 
      width: 100vw;
      overflow: hidden; 
    }

    .custom-scrollbar::-webkit-scrollbar { width: 8px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #cbd5e1; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #64748b; border-radius: 10px; }
    
    ::ng-deep .pagedjs_pages {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      width: 100% !important;
      padding: 40px 0 !important;
    }

    ::ng-deep .pagedjs_page {
      background: white !important;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3) !important;
      margin: 10px auto !important;
      display: block !important;
      flex-shrink: 0 !important;
    }

    /* Evitar que PagedJS oculte contenido por desbordamiento visual en la previa */
    ::ng-deep .pagedjs_page_content {
      overflow: visible !important;
    }
  `]
})
export default class GestionCartasPageComponent {
  @ViewChild('renderContainer') renderContainer!: ElementRef;

  public tipoAfiliacion: string = 'Red de referidos';
  public tipoSolicitud: string = '';
  public cargando: boolean = false;
  public camposDetectados: string[] = [];
  public valores: { [key: string]: string } = {};
  
  private htmlMaster: string = '';
  private estilosMaster: string[] = [];

  constructor(private cdr: ChangeDetectorRef) {}

  public formatLabel(value: string): string {
    return value
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, c => c.toUpperCase());
  }

  public async onSolicitudChange(): Promise<void> {
    if (!this.tipoSolicitud) return;
    
    const nombreArchivo = this.tipoSolicitud === 'Registro de Afiliación' 
      ? 'carta-de-entendimiento.html' 
      : 'cambio-cuenta-bancaria.html';
      
    await this.cargarYDetectar(`assets/${nombreArchivo}`);
  }

  private async cargarYDetectar(ruta: string): Promise<void> {
    this.cargando = true;
    this.cdr.detectChanges();
    
    try {
      const response = await fetch(ruta);
      if (!response.ok) throw new Error('Archivo no encontrado');
      
      const fullHtml = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(fullHtml, 'text/html');
      
      // CAPTURA DE ESTILOS: Importante para mantener saltos de línea y espaciados
      this.estilosMaster = Array.from(doc.querySelectorAll('style')).map(s => s.innerHTML);
      
      // CAPTURA DE CONTENIDO: Buscamos el contenedor principal de PagedJS o el article
      const contentNode = doc.querySelector('.pagedjs_pages') || doc.querySelector('article') || doc.body;
      this.htmlMaster = contentNode.innerHTML;
      
      // Detección de variables
      const regex = /\$\{([^}]+)\}/g;
      let match;
      const encontrados = new Set<string>();
      while ((match = regex.exec(this.htmlMaster)) !== null) {
        encontrados.add(match[1]);
      }
      
      this.camposDetectados = Array.from(encontrados);
      this.camposDetectados.forEach(campo => {
        if (this.valores[campo] === undefined) this.valores[campo] = '';
      });

      await this.procesarYRenderizar();
    } catch (error) {
      console.error("Error:", error);
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }

  public async procesarYRenderizar(): Promise<void> {
    if (!this.htmlMaster) return;
    
    this.cargando = true;
    this.cdr.detectChanges();

    try {
      let htmlSustituido = this.htmlMaster;
      this.camposDetectados.forEach(campo => {
        const valor = this.valores[campo] || `\${${campo}}`;
        htmlSustituido = htmlSustituido.split(`\${${campo}}`).join(valor);
      });

      const container = this.renderContainer.nativeElement;
      container.innerHTML = ''; 

      // Combinamos estilos base con los estilos originales del documento
      const baseStyle = `
        @page { 
          size: 215.9mm 279.4mm; 
          margin: 25.4mm !important; 
        }
        /* Forzar que los párrafos respeten su estilo de bloque */
        p { margin-bottom: 1em; line-height: 1.5; }
        .pagedjs_page_content { padding: 0 !important; }
      `;

      const allStyles = [baseStyle, ...this.estilosMaster];

      const paged = new Previewer();
      await paged.preview(htmlSustituido, allStyles, container);

      this.cargando = false;
      this.cdr.detectChanges();
    } catch (error) {
      console.error("Error render:", error);
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}