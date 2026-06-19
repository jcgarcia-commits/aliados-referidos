import { ChangeDetectionStrategy, Component, type OnInit, ViewChild, ElementRef } from '@angular/core';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-upsert-solicitud',
  imports: [],
  templateUrl: './upsert-solicitud.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertSolicitud implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef;

  ngOnInit(): void { initFlowbite(); }


  generarDocumento() {
  this.mostrarToast("Documento Generado", "success");
}


    archivoSeleccionado(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;



  // Simulación de procesamiento
  setTimeout(() => {
    this.mostrarToast("Cargando archivo: " + file.name, "success");

  }, 1500);
}



mostrarToast(mensaje: string, tipo: 'info' | 'success' | 'error' = 'info') {
  const contenedor = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `
    flex items-center gap-3 px-4 py-3 rounded shadow-lg text-white 
    animate-slide-in
    ${tipo === 'info' ? 'bg-green-600' : ''}
    ${tipo === 'success' ? 'bg-green-600' : ''}
    ${tipo === 'error' ? 'bg-red-600' : ''}
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
