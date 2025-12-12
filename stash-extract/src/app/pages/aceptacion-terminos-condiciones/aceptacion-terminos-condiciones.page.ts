import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, signal, ViewChild, NgModule, type OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';

import { LucideAngularModule, SquarePen, Trash2, Newspaper, ReceiptText, FileText , FilePen, PrinterCheck, FileUp   } from 'lucide-angular';



export interface IEmpresa {
  empresaId?: string;
  nombre: string;
  direccion: string;
  nit: string;
  telefono: string;
  activo: boolean;
}


const emptyEmpresa: IEmpresa = {
  empresaId: '',
  nombre: '',
  direccion: '',
  nit: '',
  telefono: '',
  activo: true,
}

@Component({
  selector: 'app-test-page',
  imports: [LucideAngularModule, FormsModule,RouterLink, CommonModule ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './aceptacion-terminos-condiciones.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class IngresoAliadoPageComponent {

  protected readonly title = signal('gestion-cuentas-bancarias');

readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;
  readonly Newspaper  = Newspaper ;
  readonly ReceiptText  = ReceiptText ;
  readonly FileText  = FileText ;
  readonly FilePen  = FilePen ;
  readonly PrinterCheck  = PrinterCheck ;
  readonly FileUp  = FileUp ;

  searchMode: 'nombre' | 'documento' = 'nombre';
  showModal = signal(false);
  showModal_1 = signal(false);

isPrinting: { [id: number]: boolean } = {};


alertVisible: boolean = false;
showSuccess = false;
isFadingOut: boolean = false;


   @ViewChild('fileInput') fileInput!: ElementRef;

  empresasList = signal<IEmpresa[]>([
    {
      empresaId: '1',
      nombre: 'LIBRERIA MILENIUM',
      direccion: '12345678-9',
      nit: 'Individual',
      telefono: 'MONETARIA',
      activo: true
    },
        {
      empresaId: '1',
      nombre: 'LIBRERIA EL PORVENIR',
      direccion: '7457678-k',
      nit: 'Individual',
      telefono: 'MONETARIA',
      activo: true
    }
  ]);
  
  nuevoEmpresa = signal(true)
  empresaEdit = signal<IEmpresa>(emptyEmpresa)

  isLoading = signal(false);
  isUploading: { [key: number]: boolean } = {};
  formKey = signal(Date.now());


  modal = signal({
    titulo: 'Crear Aliado',
    visible: false,
  });

  deleteModalVisible = signal(false);

  buscador = signal('');

  constructor() { }

  ngOnInit() {
    this.fetchData();
  }

  ngAfterViewInit() {
  }



imprimir() {
  this.mostrarToast("Generando...", "info");
}


  seleccionarArchivo() {
    this.fileInput.nativeElement.click(); // abre el explorador de archivos
  }


abrirSelectorArchivo(input: HTMLInputElement) {
  input.click();
}


/*
archivoSeleccionado(event: any, id: number) {
  const archivo = event.target.files[0];
  if (archivo) {
    this.mostrarToast("Cargando archivo: " + archivo.name, "success");
    
  }

}
  */

archivoSeleccionado(event: Event, index: number) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  this.isUploading[index] = true;

  // Simulación de procesamiento
  setTimeout(() => {
    this.mostrarToast("Cargando archivo: " + file.name, "success");

    this.isUploading[index] = false;
  }, 1500);
}



  async fetchData() {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    // Simulamos una llamada a una API con un retraso
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Aquí podrías filtrar por el buscador
    const searchTerm = this.buscador().toLowerCase();
    if (searchTerm) {
      const filtered = this.empresasList().filter(e => 
        e.nombre.toLowerCase().includes(searchTerm)
      );
      // En una app real, aquí harías la petición filtrada
    }
    
    this.isLoading.set(false);
  }

  async deleteEmpresa(empresa: IEmpresa) {
    // Simulamos eliminación
    const currentList = this.empresasList();
    const updatedList = currentList.filter(e => e.empresaId !== empresa.empresaId);
    this.empresasList.set(updatedList);
    this.closeDeleteModal();
  }


  async createEmpresa(empresa: IEmpresa) {
    // Generamos un ID único
    const newId = (this.empresasList().length + 1).toString();
    const newEmpresa = { ...empresa, empresaId: newId };
    
    // Añadimos a la lista
    this.empresasList.set([...this.empresasList(), newEmpresa]);
    this.closeModal();
  }

  async updateEmpresa(empresa: IEmpresa) {
    // Actualizamos la empresa en la lista
    const currentList = this.empresasList();
    const updatedList = currentList.map(e => 
      e.empresaId === empresa.empresaId ? empresa : e
    );
    this.empresasList.set(updatedList);
    this.closeModal();
  }

  async upsertEmpresa(empresa: IEmpresa) {
    if (!empresa.empresaId || empresa.empresaId === '') {
      this.createEmpresa(empresa);
    } else {
      this.updateEmpresa(empresa);
    }
  }


  openModal() {
this.showModal.set(true);  
  }

  closeModal() {
    this.showModal.set(false);
  }


  openModal_1() {
this.showModal_1.set(true);  
  }

  closeModal_1() {
    this.showModal_1.set(false);
  }

  openDeleteModal(empresa: IEmpresa) {
    this.empresaEdit.set(empresa);
    this.deleteModalVisible.set(true);
  }

  closeDeleteModal() {
    this.deleteModalVisible.set(false);
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




procesarImpresion(id: number) {

   this.mostrarToast("Generando...", "info");
  if (this.isPrinting[id]) return;

  this.isPrinting[id] = true;
  this.alertVisible = true;
  this.isFadingOut = false;

  // Detener spinner después de 2s
  setTimeout(() => {
    this.isPrinting[id] = false;
  }, 2000);

  // Iniciar fade-out
  setTimeout(() => {
    this.isFadingOut = true;
  }, 2200);

  // Remover la alerta del DOM
  setTimeout(() => {
    this.alertVisible = false;
  }, 2700);
}




}
