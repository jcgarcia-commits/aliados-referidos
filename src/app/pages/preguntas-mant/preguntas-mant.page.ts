import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, signal, ViewChild, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UpsertPreguntas } from '../../components/upsert-preguntas/upsert-preguntas';

import { LucideAngularModule, SquarePen, Trash2, TicketCheck, FileUser    } from 'lucide-angular';



export interface IEmpresa {
  empresaId?: string;
  nombre: string;
  direccion: string;
  nit: string;
  telefono: string;
  orden: string;
  otro: string
  activo: boolean;
}


const emptyEmpresa: IEmpresa = {
  empresaId: '',
  nombre: '',
  direccion: '',
  nit: '',
  telefono: '',
  orden: '',
  otro: '',
  activo: true,
}
@Component({
  selector: 'app-test-page',
    imports: [LucideAngularModule, FormsModule,RouterLink, CommonModule, UpsertPreguntas],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './preguntas-mant.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GestionSolicitudesPageComponent {

  protected readonly title = signal('aliados-referidos');

 readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  filtro1 = '';
filtro2 = '';

filtroTipoAfiliacion = signal('');
filtroTipoSolicitud = signal('');

  empresasList = signal<IEmpresa[]>([
    {
      empresaId: '1',
      nombre: 'Revisión del formulario completo?',
      direccion: 'Number',
      nit: 'Select Dropdown',
      telefono: '1',
      orden: '1',
      otro: '0',
      activo: true
    },
    {
      empresaId: '2',
      nombre: 'El nombre del afiliado es correcto?',
      direccion: 'Number',
      nit: 'Select Dropdown',
      telefono: '2',
      orden: '2',
      otro: '0',
      activo: true
    }
  ]);
  
  nuevoEmpresa = signal(true)
  empresaEdit = signal<IEmpresa>(emptyEmpresa)

  isLoading = signal(false);
  formKey = signal(Date.now());

  modal = signal({
    titulo: 'Crear Tipo Afiliación',
    visible: false,
  });

  deleteModalVisible = signal(false);

  buscador = signal('');

    @ViewChild('fileInput') fileInput!: ElementRef;

  constructor() { }

  ngOnInit() {
    this.fetchData();
  }

  ngAfterViewInit() {
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

  openModal(nuevo: boolean = true, empresa: IEmpresa = emptyEmpresa) {
    this.nuevoEmpresa.set(nuevo);

    if (this.nuevoEmpresa()) {
      this.empresaEdit.set(emptyEmpresa)
    } else {
      this.empresaEdit.set(empresa);
    }
    this.formKey.set(Date.now()); // esto obliga al componente hijo a resetear
    this.modal.set({ titulo: nuevo ? 'Crear Pregunta' : 'Actualizar Pregunta', visible: true });    
  }

  closeModal() {
    this.modal.set({ ...this.modal(), visible: false });
  }

  openDeleteModal(empresa: IEmpresa) {
    this.empresaEdit.set(empresa);
    this.deleteModalVisible.set(true);
  }

  closeDeleteModal() {
    this.deleteModalVisible.set(false);
  }


  validarAntesDeCrear() {
  if (!this.filtroTipoAfiliacion() || !this.filtroTipoSolicitud()) {
    this.mostrarToast('Debe seleccionar Tipo Afiliación y Tipo Solicitud', 'error');
    return;
  }

  this.openModal(true);
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
