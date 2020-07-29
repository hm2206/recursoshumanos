'use strict'

const Route = use('Route')

// custumizar group
const addGroup = (group) => {
  group.prefix('api');
  return group;
}


// ruta v1
addGroup(Route.group(() => {

  // ruta publica de convocatoria
  Route.get('public/convocatoria', 'public/ConvocatoriaPublicController.index');
  Route.get('public/convocatoria/:id/staff_requirement', 'public/ConvocatoriaPublicController.staffRequirement');
  Route.get('public/convocatoria/:id/actividades', 'public/ConvocatoriaPublicController.actividades');

  // ruta publica del staff
  Route.get('public/staff_requirement/:slug', 'public/StaffRequirementPublicController.show');
  Route.get('public/staff_requirement/:slug/dependencia', 'public/StaffRequirementPublicController.dependencia');
  Route.get('public/staff_requirement/:slug/requisitos', 'public/StaffRequirementPublicController.requisitos');

  // Ruta de Postulantes
  Route.get('postulante', 'PostulanteController.index');
  Route.post('postulante', 'PostulanteController.store');

  // Ruta de Dependencias
  Route.get('dependencia', 'DependenciaController.index');
  Route.post('dependencia', 'DependenciaController.store');
  Route.get('dependencia/:id', 'DependenciaController.show');
  Route.post('dependencia/:id/update', 'DependenciaController.update');
  Route.get('dependencia/:id/perfil_laboral', 'DependenciaController.perfilLaboral');

  // Ruta para el Perfil Laboral
  Route.get('perfil_laboral', 'PerfilLaboralController.index')
  Route.get('perfil_laboral/:id', 'PerfilLaboralController.show')

  // Ruta para configurar el Perfil Laboral y Dependencia
  Route.resource('config_perfil_laboral', 'ConfigPerfilLaboralController').apiOnly();

  // Ruta Convocatoria
  Route.get('convocatoria', 'ConvocatoriaController.index').middleware(['entityId']);
  Route.post('convocatoria', 'ConvocatoriaController.store');
  Route.get('convocatoria/:id', 'ConvocatoriaController.show');
  Route.post('convocatoria/:id/update', 'ConvocatoriaController.update');
  Route.get('convocatoria/:id/actividades', 'ConvocatoriaController.actividades');
  Route.get('convocatoria/:id/staff_requirements', 'ConvocatoriaController.staffRequirements');
  Route.post('convocatoria/:id/publicar', 'ConvocatoriaController.publicar');
  Route.post('convocatoria/:id/terminar', 'ConvocatoriaController.terminar');
  Route.post('convocatoria/:id/cancelar', 'ConvocatoriaController.cancelar');

  // Ruta Requerimientos de Personal
  Route.get('staff_requirement', 'StaffRequirementController.index').middleware(['entityId']);
  Route.post('staff_requirement', 'StaffRequirementController.store');
  Route.get('staff_requirement/:id', 'StaffRequirementController.show');
  Route.post('staff_requirement/:id/update', 'StaffRequirementController.update');
  Route.get('staff_requirement/:id/requisitos', 'StaffRequirementController.requisitos');
  Route.get('staff_requirement/:id/etapa', 'StaffRequirementController.etapa');
  Route.post('staff_requirement/:id/publicar', 'StaffRequirementController.publicar');
  Route.post('staff_requirement/:id/terminar', 'StaffRequirementController.terminar');
  Route.post('staff_requirement/:id/cancelar', 'StaffRequirementController.cancelar');

  // Ruta de Requisitos para el requerimiento del personal
  Route.post('requisito', 'RequisitoController.store');

  // Ruta actividad
  Route.resource('actividad', 'ActividadController').apiOnly();


}));


