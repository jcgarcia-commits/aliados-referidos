import {
  ChangeDetectionStrategy,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChildren,
  QueryList,
  ChangeDetectorRef 
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { 
  Document, 
  Packer, 
  Paragraph, 
  TextRun, 
  Header, 
  ImageRun, 
  AlignmentType, 
  TextWrappingType,
HorizontalPositionRelativeFrom, 
  VerticalPositionRelativeFrom
} from 'docx';



import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';




/* 🔹 TIPOS */
type Parte =
  | { tipo: 'texto'; valor: string }
  | { tipo: 'campo'; valor: string; bold?: boolean };

type EstiloLista = 'numeros' | 'letras' | 'romanos' | 'vinetas' | 'plana';

type Bloque =
  | { tipo: 'titulo'; texto: string }
  | { tipo: 'subtitulo'; texto: string }
  | { tipo: 'parrafo'; partes: Parte[] }
  | { tipo: 'lista'; items: string[]; estilo: EstiloLista}
|   { 
      tipo: 'firmas'; 
      firmantes: { 
        titulo: string; 
        lineas: Parte[][]; // Cada línea es un conjunto de partes (texto/campo)
      }[] 
    };

@Component({
  selector: 'app-test-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './carta-entendimiento.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GestionCartasPageComponent {

paginas: any[][] = [];
documentoGenerado: boolean = false;
tipoAfiliacion: string = '';
tipoSolicitud: string = '';

  @ViewChildren('documentoRender') documentos!: QueryList<ElementRef>;
  
  constructor(private cdr: ChangeDetectorRef) {}

  data: { bloques: Bloque[] } = {
    bloques: [

      { tipo: 'titulo', texto: 'CARTA DE ENTENDIMIENTO' },
      { tipo: 'subtitulo', texto: 'RED DE REFERIDOS FUNDEA' },
      {
        tipo: 'parrafo',
        partes: [
          { tipo: 'texto', valor: 'En el municipio de ' },
          { tipo: 'campo', valor: 'Chimaltenango', bold: true },
          { tipo: 'texto', valor: ', departamento de ' },
          { tipo: 'campo', valor: 'Chimaltenango', bold: true },
          { tipo: 'texto', valor: ', el día ' },
          { tipo: 'campo', valor: '20', bold: true },
          { tipo: 'texto', valor: ' de ' },
          { tipo: 'campo', valor: 'abril', bold: true },
          { tipo: 'texto', valor: ' de ' },
          { tipo: 'campo', valor: '2026', bold: true },
          { tipo: 'texto', valor: ', comparecen:' }
        ]
      },
      {
          tipo: 'parrafo',
          partes: [
        { tipo: 'texto', valor: 'I. FUNDACIÓN PARA EL DESARROLLO EMPRESARIAL Y AGRÍCOLA –FUNDEA–, entidad no lucrativa debidamente constituida conforme las leyes de la República de Guatemala, representada en este acto por ' },
        { tipo: 'campo', valor: 'NOMBRES Y APELLIDOS', bold: true },
        { tipo: 'texto', valor: ', quien se identifica con DPI No.' },
        { tipo: 'campo', valor: '4512789650101', bold: true },
        { tipo: 'texto', valor: ', en su calidad de ' },
        { tipo: 'campo', valor: 'REPRESENTANTE LEGAL', bold: true },
        { tipo: 'texto', valor: ' (acreditar representación legal).' },
      ]
      },
      { tipo: 'parrafo', partes: [{ tipo: 'texto', valor: 'CLÁUSULA PRIMERA – OBJETO' }] },
      {
          tipo: 'parrafo',
          partes: [
        { tipo: 'texto', valor: 'El presente documento tiene por finalidad establecer los términos de cooperación mediante los cuales LA EMPRESA AFILIADA referirá a FUNDEA clientes potenciales interesados en la obtención de crédito, conforme políticas internas y normativa aplicable.' }
      ]
      },
      { tipo: 'parrafo', partes: [{ tipo: 'texto', valor: 'CLÁUSULA SEGUNDA – RESPONSABILIDADES DE LA EMPRESA AFILIADA' }] },
      {
        tipo: 'lista',
        estilo: 'numeros',
        items: [
          'Enviar información de clientes potenciales mediante la aplicación autorizada.',
          'Completar toda la información requerida, bajo principio de veracidad.',
          'Capacitar a sus colaboradores según lineamientos de FUNDEA.',
          'Abstenerse de prometer aprobaciones o condiciones crediticias.',
          'Cumplir legislación de protección de datos.'
        ]
      },
      { tipo: 'parrafo', partes: [{ tipo: 'texto', valor: 'CLÁUSULA TERCERA – RESPONSABILIDADES DE FUNDEA' }] },
      {
        tipo: 'lista',
        estilo: 'numeros',
        items: [
          'Recibir y evaluar solicitudes.',
          'Procesar información conforme normativa vigente.',
          'Pagar comisiones en los plazos establecidos.',
          'Proporcionar capacitación necesaria.',
          'Cumplir legislación de protección de datos.'
        ]
      },
      {
          tipo: 'parrafo',
          partes: [
        { tipo: 'texto', valor: 'De la observación especial: Con los clientes referidos, FUNDEA, a través de su departamento específico o personas designadas, realizarán el estudio crediticio para determinar la aprobación o no de la solicitud de crédito. FUNDEA en ningún caso garantizará la aprobación del crédito que se realice en la forma y modo de esta carta de entendimiento.' }
      ]
      },
      { tipo: 'parrafo', partes: [{ tipo: 'texto', valor: 'CLÁUSULA CUARTA – TABLA DE COMISIONES' }] },
      {
        tipo: 'lista',
        estilo: 'plana',
        items: [
          '1–4 desembolsos/mes: Q100 c/u',
          '5–9 desembolsos/mes: Q150 c/u',
          '10 desembolsos/mes o más: Q200 c/u'
        ]
      },
      { tipo: 'parrafo', partes: [{ tipo: 'texto', valor: 'Condiciones para devengar comisión:' }] },
      {
        tipo: 'lista',
        estilo: 'letras',
        items: [
          'Cliente nuevo.',
          'Formulario completo.',
          'Crédito aprobado y desembolsado posterior a la fecha de referencia.'
        ]
      },      
      { tipo: 'parrafo', partes: [{ tipo: 'texto', valor: 'CLÁUSULA QUINTA – CUENTA BANCARIA AUTORIZADA PARA RECEPCIÓN DE PAGOS' }] },
      {
          tipo: 'parrafo',
          partes: [
        { tipo: 'texto', valor: 'LA EMPRESA AFILIADA autoriza que el pago de las comisiones generadas por referidos desembolsados sea acreditado a la cuenta bancaria de ' },
        { tipo: 'campo', valor: 'NOMBRES Y APELLIDOS', bold: true },
        { tipo: 'texto', valor: ', de tipo ' },
        { tipo: 'campo', valor: 'Monetaria', bold: true },
        { tipo: 'texto', valor: ', número' },
        { tipo: 'campo', valor: '01401234550210101 LEGAL', bold: true },
        { tipo: 'texto', valor: '. En caso de requerir cambio de cuenta bancaria, LA EMPRESA AFILIADA deberá informar a FUNDEA de forma escrita con un mes de anticipación a su aplicación efectiva.' },
      ]
      },
      { tipo: 'parrafo', partes: [{ tipo: 'texto', valor: 'CLÁUSULA SEXTA – CONFIDENCIALIDAD Y PROTECCIÓN DE DATOS' }] },
      { tipo: 'parrafo', partes: [
        { tipo: 'texto', valor: 'Ambas partes deberán mantener estricta confidencialidad y cumplir la normativa aplicable, notificando cualquier filtración inmediatamente.' }
      ] },
      { tipo: 'parrafo', partes: [{ tipo: 'texto', valor: 'CLÁUSULA SÉPTIMA – SUPERVISIÓN Y COMUNICACIÓN' }] },   
      {
        tipo: 'parrafo',
          partes: [
        { tipo: 'texto', valor: 'Coordinación a cargo del Jefe(a) de Agencia ' },
        { tipo: 'campo', valor: 'NOMBRES Y APELLIDOS', bold: true },
        { tipo: 'texto', valor: 'de FUNDEA y el representante designado de LA EMPRESA AFILIADA.' }
      ]
      },
      { tipo: 'parrafo', partes: [{ tipo: 'texto', valor: 'CLÁUSULA OCTAVA – LIMITACIÓN DE RESPONSABILIDAD' }] }, 
      {
        tipo: 'parrafo',
          partes: [
        { tipo: 'texto', valor: 'FUNDEA es la única entidad responsable del análisis y aprobación del crédito. No se generan relaciones laborales ni obligaciones adicionales.' }
      ]
      },
      { tipo: 'parrafo', partes: [{ tipo: 'texto', valor: 'CLÁUSULA NOVENA – TERMINACIÓN' }] }, 
      {
        tipo: 'parrafo',
          partes: [
        { tipo: 'texto', valor: 'FUNDEA podrá revocar la afiliación en cualquier momento mediante notificación escrita. Cualquier modificación deberá hacerse mediante intercambio de cartas.' }
      ]
      },
      { tipo: 'parrafo', partes: [{ tipo: 'texto', valor: 'CLÁUSULA DÉCIMA – VIGENCIA' }] }, 
      {
        tipo: 'parrafo',
          partes: [
        { tipo: 'texto', valor: 'Esta carta de entendimiento entra en vigencia a partir de su firma y por tiempo indefinido.' }
      ]
      },
      

  {
    tipo: 'firmas',
    firmantes: [
      {
        titulo: 'Por FUNDEA:', // [cite: 45]
        lineas: [
          [
            { tipo: 'texto', valor: 'Nombre: ' }, 
            { tipo: 'campo', valor: 'NOMBRES Y APELLIDOS', bold: true } // [cite: 46]
          ],
          [
            { tipo: 'texto', valor: 'Cargo: ' }, 
            { tipo: 'campo', valor: 'REPRESENTANTE LEGAL', bold: true } // [cite: 47]
          ],
          [
            { tipo: 'texto', valor: 'DPI: ' }, 
            { tipo: 'campo', valor: '4512789650101', bold: true } // [cite: 48]
          ],
          [
            { tipo: 'texto', valor: 'Firma: ' }, 
            { tipo: 'texto', valor: '___________________________' } // [cite: 49]
          ]
        ]
      },
      {
        titulo: 'Por la Empresa Afiliada:', // [cite: 50]
        lineas: [
          [
            { tipo: 'texto', valor: 'Nombre: ' }, 
            { tipo: 'campo', valor: '___________________________' } // [cite: 51]
          ],
          [
            { tipo: 'texto', valor: 'Cargo: ' }, 
            { tipo: 'campo', valor: '___________________________' } // [cite: 52]
          ],
          [
            { tipo: 'texto', valor: 'DPI: ' }, 
            { tipo: 'campo', valor: '___________________________' } // [cite: 53]
          ],
          [
            { tipo: 'texto', valor: 'Firma: ' }, 
            { tipo: 'texto', valor: '___________________________' } // [cite: 54]
          ]
        ]
      }
    ]
  }
      /*,


      {
        tipo: 'lista',
        items: [
          'Elemento sin numeración 1',
          'Elemento sin numeración 2'
        ]
      }
*/
    ]
  };

  /* 🔹 HELPERS */
  crearRun(texto: string, bold = false) {
    return new TextRun({
      text: texto,
      bold,
      size: 24,
      font: 'Calibri'
    });
  }

  crearParrafo(partes: Parte[]) {
    const runs: TextRun[] = [];

    for (const parte of partes) {
      const isBold =
        parte.tipo === 'campo' && (parte.bold ?? true);

      runs.push(
        this.crearRun(parte.valor, isBold)
      );
    }

    return new Paragraph({
      alignment: AlignmentType.JUSTIFIED,
      spacing: { after: 200, line: 300 },
      children: runs,
    });
  }


async generarDocumento() {

  /* =========================
     1. PAGINACIÓN PARA HTML
     ========================= */
  const bloques = this.data.bloques;

  const tamañoPagina = 8; // 🔹 ajusta según cómo se vea
  this.paginas = [];

  for (let i = 0; i < bloques.length; i += tamañoPagina) {
    this.paginas.push(bloques.slice(i, i + tamañoPagina));
  }

  this.documentoGenerado = true;


  /* =========================
     2. GENERACIÓN DOCX (TU LÓGICA ORIGINAL)
     ========================= */
  const children: Paragraph[] = [];

  for (const bloque of this.data.bloques) {
    if (bloque.tipo === 'titulo' || bloque.tipo === 'subtitulo') {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { 
            after: bloque.tipo === 'subtitulo' ? 400 : 0 
          },
          children: [
            new TextRun({
              text: bloque.texto,
              bold: true,
              size: bloque.tipo === 'titulo' ? 32 : 28,
              font: 'Calibri',
            }),
          ],
        })
      );
    } 
    else if (bloque.tipo === 'parrafo') {
      children.push(this.crearParrafo(bloque.partes));
    } 
    else if (bloque.tipo === 'lista') {
      for (const item of bloque.items) {
        children.push(
          new Paragraph({
            numbering: bloque.estilo === 'numeros' 
              ? { reference: 'lista-numeros', level: 0 } 
              : undefined,
            bullet: bloque.estilo === 'vinetas' ? { level: 0 } : undefined,
            children: [
              new TextRun({ text: item, size: 24, font: 'Calibri' })
            ],
            spacing: { after: 120 },
          })
        );
      }
    }
  }

  const doc = new Document({
    numbering: {
      config: [
        {
          reference: 'lista-numeros',
          levels: [
            { level: 0, format: 'decimal', text: '%1.', alignment: AlignmentType.START }
          ]
        }
      ]
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 12240,
              height: 15840,
            },
            margin: {
              top: 3100,
              right: 1440,
              bottom: 1800,
              left: 1440,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                children: [
                  new ImageRun({
                    data: await fetch('./fondo-carta-entendimiento.png').then(r => r.arrayBuffer()),
                    transformation: {
                      width: 612,
                      height: 792,
                    },
                    floating: {
                      horizontalPosition: {
                        relative: HorizontalPositionRelativeFrom.PAGE,
                        offset: 0,
                      },
                      verticalPosition: {
                        relative: VerticalPositionRelativeFrom.PAGE,
                        offset: 0,
                      },
                      wrap: { type: 0 },
                      allowOverlap: true,
                      layoutInCell: false,
                    },
                  } as any),
                ],
              }),
            ],
          }),
        },
        children: children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'Carta_Entendimiento_FUNDEA.docx');
}


async descargarPDF() {

  const pdf = new jsPDF('p', 'mm', 'a4');
  const elementos = this.documentos.toArray();

  for (let i = 0; i < elementos.length; i++) {

    const canvas = await html2canvas(elementos[i].nativeElement, {
      scale: 1.6, 
      useCORS: true,
      backgroundColor: '#ffffff'
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    const imgData = canvas.toDataURL('image/jpeg', 0.85); 

    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
  }

  pdf.save('carta-entendimiento.pdf');
}

generarVista() {
  const bloques = this.data.bloques;

  const tamañoPagina = 8;

  this.cdr.markForCheck();
  this.paginas = [];

  for (let i = 0; i < bloques.length; i += tamañoPagina) {
    this.paginas.push(bloques.slice(i, i + tamañoPagina));
  }

  this.documentoGenerado = true;
}


async descargarDOCX() {
  const children: Paragraph[] = [];

  for (const bloque of this.data.bloques) {
    if (bloque.tipo === 'titulo' || bloque.tipo === 'subtitulo') {
      children.push(
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: bloque.tipo === 'subtitulo' ? 400 : 0 },
          children: [
            new TextRun({
              text: bloque.texto,
              bold: true,
              size: bloque.tipo === 'titulo' ? 32 : 28,
              font: 'Calibri',
            }),
          ],
        })
      );
    } 
    else if (bloque.tipo === 'parrafo') {
      children.push(this.crearParrafo(bloque.partes));
    } 
    else if (bloque.tipo === 'lista') {
      for (const item of bloque.items) {
        children.push(
          new Paragraph({
            numbering: bloque.estilo === 'numeros'
              ? { reference: 'lista-numeros', level: 0 }
              : undefined,
            bullet: bloque.estilo === 'vinetas' ? { level: 0 } : undefined,
            children: [
              new TextRun({ text: item, size: 24, font: 'Calibri' })
            ],
          })
        );
      }
    }
  }

  const doc = new Document({
    sections: [{ children }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, 'Carta_Entendimiento_FUNDEA.docx');
}

}