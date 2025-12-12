import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, signal, ViewChild, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UpsertParametro } from '../../components/upsert-parametro/upsert-parametro';

import { LucideAngularModule, SquarePen, Trash2, TicketCheck, FileUser    } from 'lucide-angular';



export interface IEmpresa {
  empresaId?: string;
  nombre: string;
  direccion: string;
  nit: string;
  telefono: string;
  orden: string;
  codigo: string;
  estado: boolean;
  activo: boolean;
}


const emptyEmpresa: IEmpresa = {
  empresaId: '',
  nombre: '',
  direccion: '',
  nit: '',
  telefono: '',
    orden: '',
    codigo: '',
  estado: true,
  activo: true,
}
@Component({
  selector: 'app-test-page',
    imports: [LucideAngularModule, FormsModule,RouterLink, CommonModule, UpsertParametro],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './gestion-preguntas.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GestionSolicitudesPageComponent {

  protected readonly title = signal('aliados-referidos');

 readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  empresasList = signal<IEmpresa[]>([
    {
      empresaId: '1',
      nombre: 'FORMULARIO COMPLETO',
      direccion: '2',
      nit: '0',
      telefono: '0',
        orden: '0',
        codigo: '0',
       estado: true,
      activo: true
    },


        {
      empresaId: '1',
      nombre: 'SI',
      direccion: '2',
      nit: '1',
      telefono: '0',
              orden: '1',
              codigo: '1',
  estado: true,
      activo: true
    },

        {
      empresaId: '1',
      nombre: 'NO',
      direccion: '2',
      nit: '1',
      telefono: '0',
              orden: '2',
                      codigo: '2',
  estado: true,
      activo: true
    },
    {
      empresaId: '2',
      nombre: 'AFILIADO CORRECTO',
      direccion: '3',
      nit: '0',
      telefono: '0',
      orden: '0',
      codigo: '0',
      estado: true,
      activo: true
    },
         {
      empresaId: '1',
      nombre: 'SI',
      direccion: '3',
      nit: '1',
      telefono: '10',
      orden: '1',
      codigo: '1',
      estado: true,
      activo: true
    },

        {
      empresaId: '1',
      nombre: 'NO',
      direccion: '3',
      nit: '1',
      telefono: '0',
      orden: '2',
      codigo: '2',
      estado: true,
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

}
