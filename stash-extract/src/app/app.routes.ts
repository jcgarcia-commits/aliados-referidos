import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'gestion-representantes',
        loadComponent: () => import('./pages/ingreso-aliado/ingreso-aliado.page')

    },
    {
         path: 'aprobacion',
        loadComponent: () => import('./pages/valida-registro-aliado/valida-registro-aliado.page')       
    },
    {
         path: 'ingreso-cuentas-bancarias',
        loadComponent: () => import('./pages/ingreso-cuentas-bancarias/ingreso-cuentas-bancarias.page')       
    },
        {
         path: 'ingreso-empresas',
        loadComponent: () => import('./pages/ingreso-empresa/ingreso-empresa.page')       
    },
            {
         path: 'asignacion-cuenta-bancaria',
        loadComponent: () => import('./pages/asignacion-cuenta-bancaria/asignacion-cuenta-bancaria.page')       
    },
            {
         path: 'aceptacion-terminos-condiciones',
        loadComponent: () => import('./pages/aceptacion-terminos-condiciones/aceptacion-terminos-condiciones.page')       
    },

            {
         path: 'gestion-solicitudes',
        loadComponent: () => import('./pages/gestion-solicitudes/gestion-solicitudes.page')       
    },

                {
         path: 'tipo-afiliacion',
        loadComponent: () => import('./pages/tipo-afiliacion-mant/tipo-afiliacion-mant.page')       
    },

                    {
         path: 'tipo-solicitud',
        loadComponent: () => import('./pages/tipo-solicitud-mant/tipo-solicitud-mant.page')       
    },

                        {
         path: 'tipo-respuesta',
        loadComponent: () => import('./pages/tipo-respuesta-mant/tipo-respuesta-mant.page')       
    },

                            {
         path: 'objeto-respuesta',
        loadComponent: () => import('./pages/objeto-respuesta-mant/objeto-respuesta-mant.page')       
    },
                                {
         path: 'preguntas',
        loadComponent: () => import('./pages/preguntas-mant/preguntas-mant.page')       
    },

    /*                                {
         path: 'parametrizacion-preguntas',
        loadComponent: () => import('./pages/gestion-preguntas/getion-preguntas.page')       
    },*/

                                        {
         path: 'gestion-grupos',
        loadComponent: () => import('./pages/gestion-grupos/gestion-grupos.page')       
    },
                                            {
         path: 'gestion-variables',
        loadComponent: () => import('./pages/gestion-variables/getion-variables.page')       
    }









  
];
