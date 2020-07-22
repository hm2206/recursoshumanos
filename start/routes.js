'use strict'

const Route = use('Route')

// custumizar group
const addGroup = (group) => {
  group.prefix('api');
  return group;
}


// ruta v1
addGroup(Route.group(() => {

  // Ruta de Postulantes
  Route.get('postulante', 'PostulanteController.index');
  Route.post('postulante', 'PostulanteController.store');

  // Ruta de Dependencias
  Route.resource('dependencia', 'DependeciaController').apiOnly();

  // Ruta para el Perfil Laboral
  Route.resource('perfil_laboral', 'PerfilLaboralController').apiOnly();

  // Ruta para configurar el Perfil Laboral y Dependencia
  Route.resource('config_perfil_laboral', 'ConfigPerfilLaboralController').apiOnly();

  // Ruta Convocatoria
  Route.get('convocatoria', 'ConvocatoriaController.index').middleware(['entityId']);
  Route.post('convocatoria', 'ConvocatoriaController.store');
  Route.get('convocatoria/:id', 'ConvocatoriaController.show');
  Route.post('convocatoria/:id/update', 'ConvocatoriaController.update');
  Route.get('convocatoria/:id/actividades', 'ConvocatoriaController.actividades');
  Route.get('convocatoria/:id/staff_requirements', 'ConvocatoriaController.staffRequirements');

  // Ruta Requerimientos de Personal
  Route.get('staff_requirement', 'StaffRequirementController.index');

  // Ruta de Requisitos para el requerimiento del personal
  Route.resource('requisito', 'RequisitoController').apiOnly();

  // Ruta actividad
  Route.resource('actividad', 'ActividadController').apiOnly();


}));


