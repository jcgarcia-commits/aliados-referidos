import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as renderDocx from 'docx-preview';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
// @ts-ignore
import { Previewer } from 'pagedjs';

@Component({
  selector: 'app-genera-doc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './genera-doc.page.html',
  styles: [
    `
    .animate-slide-in { animation: slideIn 0.5s ease-out forwards; }
    .animate-fade-out { animation: fadeOut 0.5s ease-in forwards; }
    

    .animate-shake { animation: shake 0.4s cubic-bezier(.36,.07,.19,.97) both; }

    @keyframes slideIn { from { opacity: 0; transform: translateX(100%); } to { opacity: 1; transform: translateX(0); } }
    @keyframes fadeOut { from { opacity: 1; transform: translateX(0); } to { opacity: 0; transform: translateX(100%); } }
    @keyframes shake {
      10%, 90% { transform: translate3d(-1px, 0, 0); }
      20%, 80% { transform: translate3d(2px, 0, 0); }
      30%, 50%, 70% { transform: translate3d(-4px, 0, 0); }
      40%, 60% { transform: translate3d(4px, 0, 0); }
    }

    :host { display: block; height: 100vh; width: 100vw; overflow: hidden !important; }

    .preview-window-container {
      background-color: #94a3b8 !important;
      padding: 40px 20px !important;
      overflow-y: auto !important; 
      overflow-x: hidden !important; 
      height: 100% !important;
      width: 100% !important;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start !important;
      border-radius: 1.5rem;
    }

    .input-wrapper { padding: 4px !important; }

    ::ng-deep .pagedjs_pages {
      display: flex !important;
      flex-direction: column;
      align-items: center;
      width: 100% !important;
    }

    ::ng-deep .pagedjs_page {
      background: white !important;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2) !important;
      margin: 15px 0 !important;
      border: 1px solid #cbd5e1 !important;
      flex-shrink: 0;
    }

    ::ng-deep .pagedjs_margin-content, ::ng-deep .pagedjs_margin, ::ng-deep [class*="pagedjs_margin"] {
      display: none !important;
    }

    ::ng-deep .docx_wrapper { padding: 0 !important; background: transparent !important; width: 100% !important; }
    ::ng-deep .docx { padding: 0 !important; margin: 0 !important; width: 100% !important; }

    ::ng-deep .highlight-var {
      color: #1d4ed8 !important;
      background-color: #eff6ff !important;
      font-weight: bold !important;
      padding: 0 4px !important;
      border-radius: 4px !important;
      display: inline !important; 
      border: 1px solid #dbeafe !important;
    }

    .custom-scrollbar::-webkit-scrollbar { width: 10px; height: 10px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #64748b; border-radius: 10px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: #cbd5e1; }
    `
  ]
})
export default class GeneraDocsPageComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('previewContainer') previewContainer!: ElementRef;

  public archivoOriginal: ArrayBuffer | null = null;
  public variables: string[] = [];
  public formValues: { [key: string]: string } = {};
  
  // Objeto para rastrear errores de validación
  public formErrors: { [key: string]: boolean } = {};

  public isLoading: boolean = false;
  public showToast: boolean = false;
  public isClosingToast: boolean = false;
  public toastMessage: string = '';
  public toastType: 'success' | 'error' | 'info' = 'success';

  public async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;
    const buffer = await file.arrayBuffer();
    this.archivoOriginal = buffer;
    this.isLoading = true;
    
    // Resetear valores y errores al cargar nuevo archivo
    this.formValues = {};
    this.formErrors = {};

    try {
      const container = this.previewContainer.nativeElement;
      container.innerHTML = '';
      const tempDiv = document.createElement('div');
      await renderDocx.renderAsync(buffer, tempDiv, undefined, {
        className: "docx",
        inWrapper: false,
        ignoreWidth: false,
        ignoreHeight: false
      });
      this.unificarYResaltarTodo(tempDiv);
      const paged = new Previewer();
      const styleSheet = `@page { size: 215.9mm 279.4mm; margin: 25.4mm; } .pagedjs_page_content { overflow: hidden !important; }`;
      await paged.preview(tempDiv.innerHTML, [styleSheet], container);
      setTimeout(() => this.eliminarPaginaExtra(container), 500);
      const zip = new PizZip(buffer);
      const doc = new Docxtemplater(zip, { delimiters: { start: '{', end: '}' } });
      const matches = doc.getFullText().match(/{(.*?)}/g);
      if (matches) {
        this.variables = [...new Set(matches.map(m => m.replace(/{|}/g, '')))];
        this.variables.forEach(v => { 
          if (!this.formValues[v]) this.formValues[v] = ''; 
          this.formErrors[v] = false;
        });
      }
      this.isLoading = false;
    } catch (err) {
      this.isLoading = false;
      this.mostrarToast('Error al procesar el documento', 'error');
    }
  }

  private unificarYResaltarTodo(tempContainer: HTMLElement): void {
    const blocks = tempContainer.querySelectorAll('p, td, li, span');
    blocks.forEach((block) => {
      if (block.textContent && block.textContent.includes('{')) {
        let html = block.innerHTML;
        html = html.replace(/<span[^>]*><\/span>/g, '');
        const regexVariables = /{(.*?)}/g;
        html = html.replace(regexVariables, (match) => {
          const cleanMatch = match.replace(/<\/?[^>]+(>|$)/g, ""); 
          return `<span class="highlight-var">${cleanMatch}</span>`;
        });
        block.innerHTML = html;
      }
    });
  }

  private eliminarPaginaExtra(container: HTMLElement): void {
    const pages = Array.from(container.querySelectorAll('.pagedjs_page'));
    for (let i = pages.length - 1; i >= 0; i--) {
      const pageContent = pages[i].querySelector('.pagedjs_page_content');
      const text = pageContent?.textContent?.trim() || "";
      const hasMedia = pageContent?.querySelectorAll('img, table, svg, canvas').length! > 0;
      if ((!text || /^\d+$/.test(text)) && !hasMedia) {
        pages[i].remove();
      } else { break; }
    }
  }

  public async exportarHTML(): Promise<void> {
    if (!this.previewContainer) return;
    
    const originalContainer = this.previewContainer.nativeElement;
    const pageContents = Array.from(originalContainer.querySelectorAll('.pagedjs_page_content'));
    
    let htmlFinal = '';

    pageContents.forEach((page: any) => {
      const pageClone = (page as Element).cloneNode(true) as HTMLElement;
      
      pageClone.querySelectorAll('img, style, script').forEach(el => el.remove());

      const allElements = pageClone.querySelectorAll('*');
      allElements.forEach(el => {
        const attrs = el.getAttributeNames();
        attrs.forEach(attr => {
          if (attr.startsWith('data-') || attr === 'class' && el.classList.contains('highlight-var')) {
            el.removeAttribute(attr);
          }
        });
      });

      htmlFinal += `<div class="page-sheet"><div class="content-area">${pageClone.innerHTML}</div></div>`;
    });

    const exportDoc = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <style>
          @page { size: 215.9mm 279.4mm; margin: 0; }
          body { background: #f0f2f5; margin: 0; padding: 40px 0; display: flex; flex-direction: column; align-items: center; font-family: 'Arial', sans-serif; color: #334155; }
          .page-sheet { background: white; width: 215.9mm; min-height: 279.4mm; margin-bottom: 20px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); box-sizing: border-box; page-break-after: always; position: relative; }
          .content-area { padding: 25.4mm; width: 100%; height: 100%; box-sizing: border-box; overflow: hidden; }
          table { border-collapse: collapse; width: 100%; border: 1px solid #000; margin-bottom: 1rem; }
          td, th { border: 1px solid #000; padding: 8px; vertical-align: top; font-size: 11pt; }
          p { margin: 0 0 10pt 0; line-height: 1.5; text-align: justify; font-size: 11pt; }
          span { white-space: pre-wrap; }
          h1, h2, h3 { margin-top: 0; color: #1e293b; }
          @media print {
            body { background: none; padding: 0; }
            .page-sheet { margin: 0; box-shadow: none; border: none; }
          }
        </style>
      </head>
      <body>${htmlFinal}</body>
      </html>`.trim();
    
    const blob = new Blob([exportDoc], { type: 'text/html' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `documento-renderizado.html`;
    a.click();
    window.URL.revokeObjectURL(url);
    this.mostrarToast('Exportado con éxito', 'success');
  }

  public async guardarPlantilla(): Promise<void> {
    if (!this.archivoOriginal) return;

    // Identificar qué campos están vacíos
    let tieneErrores = false;
    this.variables.forEach(v => {
      if (!this.formValues[v] || this.formValues[v].trim() === '') {
        this.formErrors[v] = true;
        tieneErrores = true;
      } else {
        this.formErrors[v] = false;
      }
    });

    if (tieneErrores) {
      this.mostrarToast('Todos los campos son obligatorios', 'error');
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      this.mostrarToast('Plantilla guardada con éxito', 'success');
    }, 1500);
  }

  private mostrarToast(mensaje: string, tipo: 'success' | 'error' | 'info'): void {
    this.toastMessage = mensaje;
    this.toastType = tipo;
    this.isClosingToast = false;
    this.showToast = true;
    setTimeout(() => {
      this.isClosingToast = true;
      setTimeout(() => { this.showToast = false; }, 500);
    }, 3000);
  }

  public formatLabel(value: string): string {
    return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}