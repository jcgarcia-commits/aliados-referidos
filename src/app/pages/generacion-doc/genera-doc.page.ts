import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as mammoth from 'mammoth';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';

@Component({
  selector: 'app-genera-doc',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './genera-doc.page.html'
})
export default class GeneraDocsPageComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  // Propiedades públicas declaradas explícitamente para el compilador
  public archivoOriginal: ArrayBuffer | null = null;
  public htmlRaw: string = '';
  public sanitizedHtml: SafeHtml = ''; // Resuelve el error TS2339 de sanitizedHtml
  public variables: string[] = [];
  public formValues: { [key: string]: string } = {};
  public isLoading: boolean = false;
  public showToast: boolean = false;

  constructor(private sanitizer: DomSanitizer) {
    // Inicialización de seguridad
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml('');
  }

  public async onFileSelected(event: any): Promise<void> {
    const file = event.target.files[0];
    if (!file) return;

    const buffer = await file.arrayBuffer();
    this.archivoOriginal = buffer;

    try {
      const result = await mammoth.convertToHtml({ arrayBuffer: buffer });
      this.htmlRaw = result.value;

      const zip = new PizZip(buffer);
      const doc = new Docxtemplater(zip, {
        delimiters: { start: '${', end: '}' }
      });

      const text = doc.getFullText();
      const matches = text.match(/\${(.*?)}/g);

      if (matches) {
        this.variables = [...new Set(matches.map(m => m.replace(/\${|}/g, '')))];
        this.variables.forEach(v => {
          if (!this.formValues[v]) this.formValues[v] = '';
        });
      }

      this.actualizarVista();
    } catch (err) {
      console.error('Error al procesar archivo:', err);
    }
  }

  // Resuelve el error TS2339 de actualizarVista
  public actualizarVista(): void {
    let tempHtml = this.htmlRaw || '';
    for (const key of this.variables) {
      const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
      const value = this.formValues[key] || `\${${key}}`;
      tempHtml = tempHtml.replace(
        regex,
        `<b class="text-blue-700 underline font-bold px-1 rounded bg-blue-50">${value}</b>`
      );
    }
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(tempHtml);
  }

  public async guardarPlantilla(): Promise<void> {
    if (!this.archivoOriginal) return;
    this.isLoading = true;
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      this.isLoading = false;
      this.showToast = true;
      setTimeout(() => { this.resetForm(); }, 3000);
    } catch (err) {
      this.isLoading = false;
    }
  }

  public resetForm(): void {
    this.archivoOriginal = null;
    this.htmlRaw = '';
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml('');
    this.variables = [];
    this.formValues = {};
    this.showToast = false;
    this.isLoading = false;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  public formatLabel(value: string): string {
    return value.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
}