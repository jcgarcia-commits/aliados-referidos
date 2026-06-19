import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <--- IMPORTANTE
import { FormsModule } from '@angular/forms';   // <--- IMPORTANTE
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import * as mammoth from 'mammoth';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';



@Component({
  selector: 'app-genera-doc',
  standalone: true, // Asumo que es standalone por los errores
  imports: [CommonModule, FormsModule],
  templateUrl: './genera-doc.page.html'
})
export default class GeneraDocsPageComponent {
  htmlRaw: string = ''; // Contenido original del Word
  variables: string[] = []; // Nombres de las etiquetas encontradas
  formValues: { [key: string]: string } = {}; // Valores que escribe el usuario

  constructor(private sanitizer: DomSanitizer) {}

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    const arrayBuffer = await file.arrayBuffer();
    
    // Convertimos el .docx a HTML limpio
    const result = await mammoth.convertToHtml({ arrayBuffer });
    this.htmlRaw = result.value;

    // Buscamos el patrón ${variable}
    // Usamos una Regex que capture lo que está dentro de ${...}
    const matches = this.htmlRaw.match(/\${(.*?)}/g);
    
    if (matches) {
      // Limpiamos duplicados y quitamos los símbolos ${ }
      this.variables = [...new Set(matches.map(m => m.replace(/\${|}/g, '')))];
      
      // Inicializamos el formulario
      this.variables.forEach(v => {
        if (!this.formValues[v]) this.formValues[v] = '';
      });
    }
  }

  // Este getter procesa el HTML en tiempo real para la vista
  get processedContent(): SafeHtml {
    let tempHtml = this.htmlRaw;

    for (const key of this.variables) {
      const searchValue = `\${${key}}`;
      const userValue = this.formValues[key];
      
      // Si el usuario escribió algo, lo resaltamos en azul, si no, en rojo
      const replacement = userValue 
        ? `<span class="bg-blue-100 text-blue-800 px-1 rounded font-medium border-b border-blue-300">${userValue}</span>`
        : `<span class="text-red-400 font-mono italic">\${${key}}</span>`;
      
      // Reemplazo global
      tempHtml = tempHtml.split(searchValue).join(replacement);
    }

    return this.sanitizer.bypassSecurityTrustHtml(tempHtml);
  }

  async downloadPDF() {
    const data = document.getElementById('preview-doc');
    if (!data) return;

    // Configuramos html2canvas para alta calidad
    const canvas = await html2canvas(data, { scale: 2 });
    const imgWidth = 210; // A4 en mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    const contentDataURL = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save('documento-final.pdf');
  }
}