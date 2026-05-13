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
    :host { display: block; height: 100vh; width: 100vw; overflow: hidden; }
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
      margin: 15px auto !important;
      flex-shrink: 0 !important;
    }
    /* CRÍTICO: Asegura que el contenido no se oculte ni se corte */
    ::ng-deep .pagedjs_page_content { overflow: visible !important; }
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
    return value.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  }

  public async onSolicitudChange(): Promise<void> {
    if (!this.tipoSolicitud) return;

    // Usamos nombres quemados para evitar ambigüedades en la URI
    let fileToLoad = '';
    if (this.tipoSolicitud === 'Registro de Afiliación') {
      fileToLoad = 'doc1.html';
    } else if (this.tipoSolicitud === 'Actualización cuenta bancaria') {
      fileToLoad = 'doc2.html';
    }

    if (fileToLoad) {
      await this.cargarYDetectar(`assets/${fileToLoad}`);
    }
  }

  private async cargarYDetectar(ruta: string): Promise<void> {
    this.cargando = true;
    this.cdr.detectChanges();
    
    try {
      // Cargamos el archivo como un flujo de texto puro
      const response = await fetch(ruta);
      if (!response.ok) throw new Error('Archivo no encontrado');
      
      const fullHtml = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(fullHtml, 'text/html');
      
      this.estilosMaster = Array.from(doc.querySelectorAll('style')).map(s => s.innerHTML);
      // Extraemos el contenido base (article es lo ideal para documentos de FUNDEA)
      const contentNode = doc.querySelector('article') || doc.body;
      this.htmlMaster = contentNode.innerHTML;
      
      // Detección de variables
      const regex = /\$\{([^}]+)\}/g;
      let match;
      const encontrados = new Set<string>();
      while ((match = regex.exec(this.htmlMaster)) !== null) {
        encontrados.add(match[1]);
      }
      
      this.camposDetectados = Array.from(encontrados) as string[];
      this.camposDetectados.forEach(campo => {
        if (this.valores[campo] === undefined) this.valores[campo] = '';
      });

      await this.procesarYRenderizar();
    } catch (error) {
      console.error("Error de carga:", error);
    } finally {
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

      for (const campo of this.camposDetectados) {
        // SOLUCIÓN AL URI MALFORMED: Construimos el buscador sin usar la sintaxis literal en el código
        const token = String.fromCharCode(36, 123) + campo + String.fromCharCode(125); 
        const valorActual = this.valores[campo] || token;
        htmlSustituido = htmlSustituido.split(token).join(valorActual);
      }

      const container = this.renderContainer.nativeElement;
      container.innerHTML = ''; 

      // ESTILOS DE FIDELIDAD: Corrigen saltos de línea y márgenes físicos
      const baseStyle = `
        @page { size: 215.9mm 279.4mm; margin: 25.4mm !important; }
        p { display: block !important; margin-bottom: 12pt !important; line-height: 1.4 !important; text-align: justify !important; }
        span { white-space: pre-wrap !important; }
        table { width: 100% !important; border-collapse: collapse; margin-bottom: 15pt; }
        td { border: 1px dotted #ccc; padding: 5px; }
      `;

      const paged = new Previewer();
      // Renderizamos pasando los estilos originales y los de corrección
      await paged.preview(htmlSustituido, [...this.estilosMaster, baseStyle], container);

    } catch (error) {
      console.error("Error render:", error);
    } finally {
      this.cargando = false;
      this.cdr.detectChanges();
    }
  }
}