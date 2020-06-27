'use strict'

const Actividad = use('App/Models/Actividad');

class ActividadController {

  index = async ({ request, response }) => {
    let actividades = await Actividad.query().paginate(1, 20);
    return actividades;
  }

}

module.exports = ActividadController
