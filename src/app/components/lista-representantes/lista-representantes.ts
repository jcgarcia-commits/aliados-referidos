
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, signal, ViewChild, NgModule, type OnInit, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, CommonModule } from '@angular/common';
import { HoverAccordion } from '../../components/hover-accordion/hover-accordion';


import { LucideAngularModule, SquarePen, Trash2, FileBadge   } from 'lucide-angular';


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
  selector: 'app-lista-representantes',
  imports: [LucideAngularModule, CommonModule, FormsModule],
  templateUrl: './lista-representantes.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListaRepresentantes implements OnInit {

    ngOnInit() {
      this.fetchData();
    }


    readonly SquarePen = SquarePen;
    readonly Trash2 = Trash2;
    readonly FileBadge = FileBadge;
  
    searchMode: 'nombre' | 'documento' = 'nombre';
    showModal = signal(false);
  
  
    empresasList = signal<IEmpresa[]>([
  
      {
        empresaId: '3',
        nombre: 'Paola Citán',
        direccion: '6543789210101',
        nit: 'Individual',
        telefono: '2456-7890',
        activo: false
      }
    ]);
    
    nuevoEmpresa = signal(true)
    empresaEdit = signal<IEmpresa>(emptyEmpresa)
  
    isLoading = signal(false);
    formKey = signal(Date.now());
  
    modal = signal({
      titulo: 'Crear Aliado',
      visible: false,
    });
  
    deleteModalVisible = signal(false);
  
    buscador = signal('');
  
    constructor() { }

    @Output() cerrar = new EventEmitter<void>();
  
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
  
  
    openModal() {
  this.showModal.set(true);  
    }
  
    closeModal() {
      this.showModal.set(false);
    }
  
    openDeleteModal(empresa: IEmpresa) {
      this.empresaEdit.set(empresa);
      this.deleteModalVisible.set(true);
    }
  
    closeDeleteModal() {
      this.deleteModalVisible.set(false);
    }

   
    
    accionDelBoton() {
  // 1. Mostrar toast
    this.mostrarToast("Asignado correctamente", "success");

    this.cerrar.emit();
}



mostrarToastYcerrar() {
  this.mostrarToast('Registro asignado correctamente', 'success');

  // Espera el mismo tiempo que dura el toast
  setTimeout(() => {
    this.cerrar.emit();   // <- Cierra el modal
  }, 3000);
}


mostrarToast(mensaje: string, tipo: 'info' | 'success' | 'error' = 'info') {
  const contenedor = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `
    flex items-center gap-3 px-4 py-3 rounded shadow-lg text-white 
    animate-slide-in
    ${tipo === 'info' ? 'bg-orange-600' : ''}
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
