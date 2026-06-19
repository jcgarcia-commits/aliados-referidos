import { ChangeDetectionStrategy, Component, type OnInit , signal, ViewChild, ElementRef} from '@angular/core';
import { initFlowbite } from 'flowbite';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-upsert-valida-registro-alidado-03',
  imports: [CommonModule, FormsModule],
  templateUrl: './upsert-valida-registro-alidado-03.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertValidaRegistroAlidado03 implements OnInit {

  accion: string = 'validar';
textoBoton: string = 'Validación del registro del afiliado';
colorBoton: string = 'bg-blue-600'; // color por defecto
selectedOption = '';


observacionObligatoria: boolean = false;
observacionTexto = '';

opcionesTexto: any = {
  validar: 'Registro Aprobado',
  correccion: 'Solicitar corrección en el formulario',
  rechazar: 'Registro Rechazado',
  aprobar: 'Cambio de Cuenta Bancaria Aprobado',
};

  @ViewChild('fileInput') fileInput!: ElementRef;


  ngOnInit(): void { 
    initFlowbite();
  }

  getColorToast() {
  switch (this.accion) {
    case 'validar':   return 'bg-green-600';
    case 'correccion': return 'bg-yellow-500 text-black';
    case 'rechazar':   return 'bg-red-600';
    case 'aprobar':    return 'bg-blue-600';
    default: return 'bg-gray-600';
  }
}

getTextoToast() {
  return this.opcionesTexto[this.accion] || 'ACCIÓN DESCONOCIDA';
}



actualizarBoton() {
  // Reiniciar siempre
  this.observacionObligatoria = false;

  switch (this.accion) {
    case 'validar':
      this.textoBoton = 'Validar afiliado';
      this.colorBoton = 'bg-green-600 hover:bg-green-700';
      break;

    case 'correccion':
      this.textoBoton = 'Solicitar corrección';
      this.colorBoton = 'bg-yellow-500 hover:bg-yellow-600 text-black';
      break;

    case 'rechazar':
      this.textoBoton = 'Rechazar afiliado';
      this.colorBoton = 'bg-red-600 hover:bg-red-700';
      this.observacionObligatoria = true;
      break;

    case 'aprobar':
      this.textoBoton = 'Aprobar cuenta bancaria';
      this.colorBoton = 'bg-blue-600 hover:bg-blue-700';
      break;
  }
}

onClickBoton() {
  const mensaje = this.getTextoToast();
  const color = this.getColorToast();

  this.mostrarToast(mensaje, color);
}

onAcordeonAbierto() {
  this.selectedOption = 'VALIDAR';
}


mostrarToast(mensaje: string, color: string) {
  const contenedor = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `
    flex items-center gap-3 px-4 py-3 rounded shadow-lg text-white 
    animate-slide-in
    ${color}
  `;

  toast.innerHTML = `
    <div class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
    <span>${mensaje}</span>
  `;

  contenedor?.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('animate-fade-out');
    setTimeout(() => toast.remove(), 400);
  }, 2000);
}


}
