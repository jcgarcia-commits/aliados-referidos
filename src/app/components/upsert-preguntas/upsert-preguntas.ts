import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
  inject,
  input,
  effect,
  signal,
  type OnInit
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


export interface IEmpresa {
  empresaId?: string;
  nombre: string;
  direccion: string;
  nit: string;
  telefono: string;
          orden: string;
      otro: string;
  activo: boolean;
}

export interface EmpresaValidationRules {
  nombre?: any[];
  direccion?: any[];
  nit?: any[];
  telefono?: any[];
      orden?: any[];
      otro?: any[]; 
  activo?: any[];
}
@Component({
  selector: 'app-upsert-preguntas',
  imports: [],
  templateUrl: './upsert-preguntas.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpsertPreguntas implements OnInit {

  ngOnInit(): void { }


    fb = inject(FormBuilder);
    
      empresa = input<IEmpresa>({
        nombre: '',
        direccion: '',
        nit: '',
        telefono: '',
        orden: '',
        otro: '', 
        activo: true,
      });
    
      nuevo = input<boolean>(true);
      key = input<number>(0);
    
      validationRules: EmpresaValidationRules = {
        nombre: [Validators.required, Validators.minLength(3)],
        direccion: [Validators.required, Validators.minLength(3)],
        nit: [],
        telefono: [Validators.required],
        orden: [],
        otro: [],
        activo: [],
      };
    
      @Output() save = new EventEmitter<IEmpresa>();
      @Output() cancel = new EventEmitter<void>();
    
      form = signal<FormGroup>(this.fb.group({}));
    
      constructor() {
        effect(() => {
          const _ = this.key(); // provoca que el form se reinicie cada vez que cambia el key
          const metodo = this.empresa();
          const isNuevo = this.nuevo();
    
          this.initForm(metodo, isNuevo);
        });
      }
    
      private initForm(empresa: IEmpresa, isNuevo: boolean) {
        const newForm = this.fb.group({
          nombre: [empresa.nombre, this.validationRules.nombre],
          direccion: [empresa.direccion, this.validationRules.direccion],
          nit: [empresa.nit, this.validationRules.nit],
          telefono: [empresa.telefono, this.validationRules.telefono],
          orden: [empresa.orden, this.validationRules.orden],
          otro: [empresa.otro, this.validationRules.otro],
          activo: [empresa.activo, this.validationRules.activo],
        });
    
        if (isNuevo) {
          newForm.reset({
            nombre: '',
            direccion: '',
            nit: '',
            telefono: '',
            orden: '',
            otro: '',
            activo: true,
          });
        }
        this.form.set(newForm);
      }
    
      get btnText(): string {
        return this.nuevo() ? 'Crear Pregunta' : 'Actualizar Pregunta';
      }
    
    
      onSubmit() {
        if (this.form().valid) {
          const value: IEmpresa = {
            ...this.empresa(),
            ...this.form().value,
          };
          this.save.emit(value);
        }
      }
    
      onCancel() {
        this.cancel.emit();
      }
    

}
