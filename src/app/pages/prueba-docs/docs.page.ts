import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http'; 


interface DatosContrato {
  Municipio: string;
  Departamento: string;
  Dia: string;
  Mes: string;
  YYYY: string;
  RepFUNDEA: string;
  DPIRepFUNDEA: string;
  PuestoRepFUNDEA: string;
  NombreEmpresaAfiliada: string;
  NombreRepAfiliado: string;
  DPIAfiliado: string;
  PuestoRepAfiliado: string;
  NombreCuentaRep: string;
  TipoCuentaRep: string;
  NumeroCuentaRep: string;
  JefeAgencia: string;
}

@Component({
  selector: 'app-contrato',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './docs.page.html'
})


export default class ContratoComponent {
  datos: DatosContrato = {
    Municipio: 'Guatemala',
    Departamento: 'Guatemala',
    Dia: '22',
    Mes: 'Abril',
    YYYY: '2024',
    RepFUNDEA: 'Juan Pérez',
    DPIRepFUNDEA: '1234 56789 0101',
    PuestoRepFUNDEA: 'Gerente General',
    NombreEmpresaAfiliada: 'Tecnologías Globales, S.A.',
    NombreRepAfiliado: 'María López',
    DPIAfiliado: '9876 54321 0202',
    PuestoRepAfiliado: 'Representante Legal',
    NombreCuentaRep: 'Tecnologías Globales, S.A.',
    TipoCuentaRep: 'Monetaria',
    NumeroCuentaRep: '00-123456-7',
    JefeAgencia: 'Carlos Ruiz'
  };

  htmlGenerado: SafeHtml | null = null;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer
) {}



generarDocumento() {
    // 1. Cargamos el archivo HTML desde los assets
    this.http.get('carta-entendimiento.html', { responseType: 'text' })
      .subscribe(htmlCargado => {
        
        // 2. Reemplazamos las variables manualmente
        let htmlFinal = htmlCargado;
        
        // Creamos un bucle para reemplazar cada llave de tu objeto 'datos'
        Object.keys(this.datos).forEach(key => {
          const valor = (this.datos as any)[key];
          const regex = new RegExp(`\\$\\{${key}\\}`, 'g');
          htmlFinal = htmlFinal.replace(regex, valor);
        });

        // 3. Sanitizamos y asignamos
        this.htmlGenerado = this.sanitizer.bypassSecurityTrustHtml(htmlFinal);
      });
  }



  imprimir() {
    window.print();
  }
}

