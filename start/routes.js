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
  Route.resource('postulante', 'PostulanteController').apiOnly();

  // Ruta de Dependencias
  Route.resource('dependencia', 'DependeciaController').apiOnly();

  // Ruta para el Perfil Laboral
  Route.resource('perfil_laboral', 'PerfilLaboralController').apiOnly();

  // Ruta para configurar el Perfil Laboral y Dependencia
  Route.resource('config_perfil_laboral', 'ConfigPerfilLaboralController').apiOnly();

  // Ruta Convocatoria
  Route.resource('convocatoria', 'ConvocatoriaController').apiOnly();

  // Ruta Requerimientos de Personal
  Route.resource('staff_requirement', 'StaffRequirementController').apiOnly();

  // Ruta de Requisitos para el requerimiento del personal
  Route.resource('requisito', 'RequisitoController').apiOnly();

  // Ruta actividad
  Route.resource('actividad', 'ActividadController').apiOnly();


})).prefix('v1');


