'use strict'

const Actividad = use('App/Models/Actividad');
const { validate } = use('Validator');
const { validation } = require('validator-error-adonis');

class ActividadController {

  index = async ({ request, response }) => {
    let actividades = await Actividad.query().paginate(1, 20);
    return actividades;
  }

  store = async ({ request }) => {
    await validation(validate, request.all(), {
      descripcion: 'required',
      fecha_inicio: 'required|date',
      fecha_final: 'required|date',
      responsable: 'required',
      convocatoria_id: 'required'
    });
    // guardar
    let actividad = await Actividad.create({
      descripcion: request.input('descripcion'),
      fecha_inicio: request.input('fecha_inicio'),
      fecha_final: request.input('fecha_final'),
      responsable: request.input('responsable'),
      convocatoria_id: request.input('convocatoria_id')
    }); 
    // response 
    return {
      success: true,
      code: 201,
      message: "La actividad se guardo correctamente",
      actividad
    }
  }

}

module.exports = ActividadController
