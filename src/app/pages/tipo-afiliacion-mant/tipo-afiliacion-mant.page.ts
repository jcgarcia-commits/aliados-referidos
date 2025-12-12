import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, inject, signal, ViewChild, NgModule } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UpsertTipoAfiliacion } from '../../components/upsert-tipo-afiliacion/upsert-tipo-afiliacion';

import { LucideAngularModule, SquarePen, Trash2, TicketCheck, FileUser    } from 'lucide-angular';



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
    imports: [LucideAngularModule, FormsModule,RouterLink, CommonModule, UpsertTipoAfiliacion],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './tipo-afiliacion-mant.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class GestionSolicitudesPageComponent {

  protected readonly title = signal('aliados-referidos');

 readonly SquarePen = SquarePen;
  readonly Trash2 = Trash2;

  empresasList = signal<IEmpresa[]>([
    {
      empresaId: '1',
      nombre: 'Red de Referidos',
      direccion: 'Av. Principal 123, Zona 10',
      nit: '12345678-9',
      telefono: '2345-6789',
      activo: true
    },
    {
      empresaId: '2',
      nombre: 'Tipo Afiliación 2',
      direccion: 'Calle Comercio 456, Zona 4',
      nit: '98765432-1',
      telefono: '2234-5678',
      activo: true
    },
    {
      empresaId: '3',
      nombre: 'Tipo Afiliación 3',
      direccion: 'Boulevard Los Próceres 789, Zona 16',
      nit: '55667788-0',
      telefono: '2456-7890',
      activo: false
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
    this.modal.set({ titulo: nuevo ? 'Crear tipo afiliación' : 'Actualizar tipo afiliación', visible: true });    
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
