'use strict'

const { validation, ValidatorError } = require('validator-error-adonis');
const { validate } = use('Validator');
const moment = require('moment');
const Convocatoria = use('App/Models/Convocatoria');
const Actividad = use('App/Models/Actividad');
const StaffRequirement = use('App/Models/StaffRequirement');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with convocatorias
 */
class ConvocatoriaController {
  /**
   * Show a list of all convocatorias.
   * GET convocatorias
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    let { page, estado } = request.all();
    let year = request.input('year', new Date().getFullYear());
    let mes = request.input('mes', new Date().getMonth() + 1);
    let convocatoria = Convocatoria.query()
      .whereRaw(`(MONTH(fecha_inicio) = ${mes} AND YEAR(fecha_inicio) = ${year})`);
    // filtrar por estado
    if (estado) convocatoria = convocatoria.where('estado', '=', estado);
    // get 
    convocatoria = await convocatoria.paginate(page || 1, 20);
    // response 
      return {
        success: true,
        code: 201,
        convocatoria
      }
  }


  /**
   * Create/save a new convocatoria.
   * POST convocatorias
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    // validar inputs
    await validation(validate, request.all(), {
      numero_de_convocatoria: "required|max:100|unique:convocatorias",
      fecha_inicio: "required|date",
      fecha_final: "required|date",
      observacion: "required|max:255",
      entity_id: "required"
    });
    // validar fechas
    let fecha_inicio = moment(request.input('fecha_inicio')).valueOf();
    let fecha_final = moment(request.input('fecha_final')).valueOf();
    let fecha_current = moment().valueOf();
    // validar fecha de inicio
    if (fecha_inicio < fecha_current) throw new ValidatorError([{ field: "fecha_inicio", message: "La fecha de Inicio debe ser mayor a la fecha actual!" }]);
    if (fecha_inicio >= fecha_final) throw new ValidatorError([{ field: "fecha_final", message: "La fecha Final debe ser mayor a la fecha de inicio!" }]);
    // guardar
    let convocatoria = await Convocatoria.create({
      numero_de_convocatoria: request.input('numero_de_convocatoria'),
      fecha_inicio: request.input('fecha_inicio'),
      fecha_final: request.input('fecha_final'),
      observacion: request.input('observacion'),
      entity_id: request.input('entity_id')
    });
    // response
    return {
      success: true,
      code: 201,
      message: "La convocatoria ha sido registrada con exito!",
      convocatoria
    }
  }

  /**
   * Display a single convocatoria.
   * GET convocatorias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request }) {
    let convocatoria = await Convocatoria.find(params.id);
    if (!convocatoria) throw new Error("No se encontró la convocatoria");
    // response 
    return {
      success: true,
      code: 201,
      convocatoria
    }
  }

  /**
   * Update convocatoria details.
   * PUT or PATCH convocatorias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    let convocatoria = await Convocatoria.find(params.id);
    if (!convocatoria) throw new Error("No se encontró la convocatoría");
    // validar 
    await validation(validate, request.all(), {
      fecha_final: 'required|date',
      observacion: 'required|max:255'
    });
    // actualizar
    convocatoria.fecha_final = request.input('fecha_final');
    convocatoria.observacion = request.input('observacion');
    await convocatoria.save();
    // response
    return {
      success: true,
      code: 201,
      message: "La convocatoria se registró correctamente!"
    }
  }

  /**
   * Delete a convocatoria with id.
   * DELETE convocatorias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  /**
   * 
   * @param {*} param0 
   */
  actividades = async ({ params, request }) => {
    let actividades = await Actividad.query()
      .where('convocatoria_id', params.id)
      .fetch();
    // response
    return {
      success: true,
      status: 201,
      actividades
    }
  }

  staffRequirements = async ({ params, request }) => {
    let staff = await StaffRequirement.query()
      .join('perfil_laborals as per', 'per.id', 'staff_requirements.perfil_laboral_id')
      .where('convocatoria_id', params.id)
      .select('staff_requirements.*', 'per.nombre as perfil_laboral')
      .fetch();
    // response
    return {
      success: true,
      status: 201,
      staff 
    }
  }

}

module.exports = ConvocatoriaController
