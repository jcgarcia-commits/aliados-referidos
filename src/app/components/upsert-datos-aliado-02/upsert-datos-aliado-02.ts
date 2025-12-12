import { ChangeDetectionStrategy, Component, type OnInit, ViewChild, ElementRef, ChangeDetectorRef  } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-upsert-datos-aliado-02',
  imports: [CommonModule, FormsModule],
  templateUrl: './upsert-datos-aliado-02.html',

})
export class UpsertDatosAliado02 implements OnInit {

  @ViewChild('fileIn') fileInput!: ElementRef;
@ViewChild('fileInputFront') fileInputFront!: ElementRef;
@ViewChild('fileInputBack') fileInputBack!: ElementRef;

     estadoCivil: string = "";
     mostrarConyuge: boolean = false;

  ngOnInit(): void { 
    initFlowbite();
  }

 constructor(private cdr: ChangeDetectorRef) {}

  onEstadoCivilChange() {
    const civ = this.estadoCivil;

    this.mostrarConyuge = civ === 'Casado/a' || civ === 'Unión de hecho';

    // 🔥 NECESARIO porque estás usando OnPush
    this.cdr.markForCheck();
  }

    seleccionarArchivo() {
    this.fileInput.nativeElement.click(); // abre el explorador de archivos
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
