'use strict'

const { validation, ValidatorError } = require('validator-error-adonis');
const { validate } = use('Validator');
const Convocatoria = use('App/Models/Convocatoria');
const Staff = use('App/Models/StaffRequirement');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with staffrequirements
 */
class StaffRequirementController {
  /**
   * Show a list of all staffrequirements.
   * GET staffrequirements
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response }) {
    let { page, estado } = request.all();
    let year = request.input('year', new Date().getFullYear());
    let mes = request.input('mes', new Date().getMonth() + 1);
    // get staff
    let staff = Staff.query()
      .whereRaw(`(MONTH(staff_requirements.fecha_inicio) = ${mes} AND YEAR(staff_requirements.fecha_inicio) = ${year})`)
      .where('con.entity_id', request._entity.id)
      .join('perfil_laborals as per', 'per.id', 'staff_requirements.perfil_laboral_id')
      .join('convocatorias as con', 'con.id', 'staff_requirements.convocatoria_id')
      .select('staff_requirements.*', 'per.nombre as perfil_laboral');
    // filtrar por estado 
    if (estado) staff = staff.where('staff_requirements.estado', '=', estado);
    // get staff
    staff = await staff.paginate(page || 1, 20);
    // response 
    return {
      success: true,
      staff
    }
  }

  /**
   * Create/save a new staffrequirement.
   * POST staffrequirements
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    // validar input
    await validation(validate, request.all(), {
      convocatoria_id: "required",
      sede_id: "required",
      dependencia_id: "required",
      perfil_laboral_id: "required",
      cantidad: "required",
      honorarios: "required",
      meta_id: "required",
      fecha_inicio: "required|date",
      fecha_final: "required|date",
      supervisora_id: "required",
      deberes: "required",
      bases: "required"
    });
    // validar convotacoria
    let convocatoria = await Convocatoria.query()
      .where('estado', 'CREADO')
      .where('id', request.input('convocatoria_id', ''))
      .first();
    if (!convocatoria) throw new ValidatorError([ { field: 'convocatoria_id', message: "La convocatoria no está disponible" } ])
    // guardar
    try {
      let staff = await Staff.create({ 
        convocatoria_id: request.input('convocatoria_id'),
        sede_id: request.input('sede_id'),
        dependencia_id: request.input('dependencia_id'),
        perfil_laboral_id: request.input('perfil_laboral_id'),
        cantidad: request.input('cantidad'),
        honorarios: request.input('honorarios'),
        meta_id: request.input('meta_id'),
        fecha_inicio: request.input('fecha_inicio'),
        fecha_final: request.input('fecha_final'),
        supervisora_id: request.input('supervisora_id'),
        deberes: request.input('deberes'),
        bases: request.input('bases'),
        renovacion: request.input('renovacion', 0)
      });
    } catch (error) {
      console.log(error);
      switch (error.code) {
        case 'ER_DUP_ENTRY':
          throw new ValidatorError([ { field: 'perfil_laboral_id', message: 'El requerimiento de personal ya está en uso'} ])
        default:
          throw new Error("No se pudó guardar el requerimiento de personal");
      }
    }
    // response
    return {
      success: true,
      status: 201,
      message: "El Requerimiento de Personal se guardo correctamente!"
    }
  }

  /**
   * Display a single staffrequirement.
   * GET staffrequirements/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
  }

  /**
   * Update staffrequirement details.
   * PUT or PATCH staffrequirements/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
  }

  /**
   * Delete a staffrequirement with id.
   * DELETE staffrequirements/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = StaffRequirementController
