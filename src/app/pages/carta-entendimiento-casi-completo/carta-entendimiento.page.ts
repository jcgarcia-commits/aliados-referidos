import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Document, Packer, Paragraph, TextRun, Header, ImageRun, AlignmentType, HorizontalPositionRelativeFrom, VerticalPositionRelativeFrom } from 'docx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

type Parte = { tipo: 'texto' | 'campo'; valor: string; bold?: boolean };
type EstiloLista = 'numeros' | 'letras' | 'romanos' | 'vinetas' | 'plana';
type Bloque = 
  | { tipo: 'titulo' | 'subtitulo'; texto: string } 
  | { tipo: 'parrafo'; partes: Parte[] } 
  | { tipo: 'lista'; items: string[]; estilo: EstiloLista };

@Component({
  selector: 'app-gestion-cartas',
  standalone: true,
  imports: [FormsModule, CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './carta-entendimiento.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GestionCartasPageComponent {
  @ViewChild('documentoRender', { static: false }) documentoElement!: ElementRef;

  tipoAfiliacion = 'red_referidos';
  tipoSolicitud = '';
  mostrarDocumento = false;

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
      { tipo: 'parrafo', partes: [
        { tipo: 'texto', valor: 'CLÁUSULA SEXTA – CONFIDENCIALIDAD Y PROTECCIÓN DE DATOS' },
        { tipo: 'texto', valor: 'Ambas partes deberán mantener estricta confidencialidad y cumplir la normativa aplicable, notificando cualquier filtración inmediatamente.' }
      ] },
      {
        tipo: 'parrafo',
          partes: [
        { tipo: 'texto', valor: 'CLÁUSULA SÉPTIMA – SUPERVISIÓN Y COMUNICACIÓN' },
        { tipo: 'texto', valor: 'Coordinación a cargo del Jefe(a) de Agencia ' },
        { tipo: 'campo', valor: 'NOMBRES Y APELLIDOS', bold: true },
        { tipo: 'texto', valor: 'de FUNDEA y el representante designado de LA EMPRESA AFILIADA.' }
      ]
      },
      {
        tipo: 'parrafo',
          partes: [
        { tipo: 'texto', valor: 'CLÁUSULA OCTAVA – LIMITACIÓN DE RESPONSABILIDAD' },
        { tipo: 'texto', valor: 'FUNDEA es la única entidad responsable del análisis y aprobación del crédito. No se generan relaciones laborales ni obligaciones adicionales.' }
      ]
      },
      {
        tipo: 'parrafo',
          partes: [
        { tipo: 'texto', valor: 'CLÁUSULA NOVENA – TERMINACIÓN' },
        { tipo: 'texto', valor: 'FUNDEA podrá revocar la afiliación en cualquier momento mediante notificación escrita. Cualquier modificación deberá hacerse mediante intercambio de cartas.' }
      ]
      },
      {
        tipo: 'parrafo',
          partes: [
        { tipo: 'texto', valor: 'CLÁUSULA DÉCIMA – VIGENCIA' },
        { tipo: 'texto', valor: 'Esta carta de entendimiento entra en vigencia a partir de su firma y por tiempo indefinido.' }
      ]
      }

      
    ]
  };

  activarPrevisualizacion() {
    if (this.tipoSolicitud) {
      this.mostrarDocumento = true;
      this.cdr.detectChanges();
    }
  }

async descargarPDF() {
  const pdf = new jsPDF('p', 'mm', 'a4', true);
  const paginas = this.documentoElement.nativeElement.querySelectorAll('.page-a4');

  for (let i = 0; i < paginas.length; i++) {
    const canvas = await html2canvas(paginas[i], {
      scale: 4, // Subimos a 4 para máxima nitidez en texto pequeño
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: 0,
      windowWidth: 794, // Ancho exacto de A4 en píxeles a 96dpi
      onclone: (clonedDoc) => {
        // Aseguramos que en el clon para el PDF, el estilo sea idéntico
        const page = clonedDoc.querySelectorAll('.page-a4')[i] as HTMLElement;
        page.style.boxShadow = 'none';
        page.style.border = 'none';
      }
    });

    const imgData = canvas.toDataURL('image/png', 1.0);
    if (i > 0) pdf.addPage();
    
    // El último parámetro 'FAST' ayuda a que el motor de jsPDF no distorsione los bordes del texto
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297, undefined, 'FAST');
  }
  pdf.save('carta-entendimiento-fundea.pdf');
}

  // Lógica de Word (Sin botón en el HTML)
  async generarDocumento() {
    const children: Paragraph[] = [];
    for (const bloque of this.data.bloques) {
      if (bloque.tipo === 'titulo' || bloque.tipo === 'subtitulo') {
        children.push(new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [new TextRun({ text: bloque.texto, bold: true, size: 28 })]
        }));
      } else if (bloque.tipo === 'parrafo') {
        const runs = (bloque.partes || []).map(p => new TextRun({ text: p.valor, bold: p.tipo === 'campo' }));
        children.push(new Paragraph({ alignment: AlignmentType.JUSTIFIED, children: runs }));
      }
    }
    const doc = new Document({ sections: [{ children }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, 'Carta_Entendimiento.docx');
  }
}