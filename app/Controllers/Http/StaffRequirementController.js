'use strict'

const { validation, ValidatorError } = require('validator-error-adonis');
const { validate } = use('Validator');
const Convocatoria = use('App/Models/Convocatoria');
const Staff = use('App/Models/StaffRequirement');
const Requisito = use('App/Models/Requisito');
const Etapa = use('App/Models/Etapa');

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
  async show ({ params, request }) {
    let staff = await Staff.query()
      .with('convocatoria')
      .where('id', params.id)
      .first();
    // response 
    return {
      success: true,
      message: "list staff",
      status: 201,
      staff
    }
  }

  /**
   * Update staffrequirement details.
   * PUT or PATCH staffrequirements/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request }) {
    // validar staff
    let staff = await Staff.query()
      .where("id", params.id)
      .where("estado", "CREADO")
      .first();
    if (!staff) throw new Error(`El requerimiento de personal no está disponible`);
     // validar input
     await validation(validate, request.all(), {
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
    try {
        staff.convocatoria_id = request.input('convocatoria_id'),
        staff.sede_id = request.input('sede_id'),
        staff.dependencia_id = request.input('dependencia_id'),
        staff.perfil_laboral_id = request.input('perfil_laboral_id'),
        staff.cantidad = request.input('cantidad'),
        staff.honorarios = request.input('honorarios'),
        staff.meta_id = request.input('meta_id'),
        staff.fecha_inicio = request.input('fecha_inicio'),
        staff.fecha_final = request.input('fecha_final'),
        staff.supervisora_id = request.input('supervisora_id'),
        staff.deberes = request.input('deberes'),
        staff.bases = request.input('bases', JSON.stringify([])),
        staff.renovacion = request.input('renovacion', staff.renovacion);
        await staff.save();
    } catch (error) {
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
   * Delete a staffrequirement with id.
   * DELETE staffrequirements/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }

  requisitos = async ({ params }) => {
    let requisitos = await Requisito.query()
      .where('staff_id', params.id)
      .fetch();
    // convertir bodies
    requisitos = await requisitos.toJSON();
    await requisitos.map(req => {
      req.body = JSON.parse(req.body);
      return req;
    });
    // response
    return {
      success: true,
      message: "SUCCESS_GET",
      status: 201,
      requisitos
    }
  }

  etapa = async ({ params, request }) => {
    let estado = request.input('estado', 'CURRICULAR');
    let page = request.input('page', 1);
    let etapa = await Etapa.query()
      .with('postulante')
      .where('estado', '=', estado)
      .where('staff_id', '=', params.id)
      .paginate(page, 20);
    // response 
    return {
      success: true,
      status: 201,
      etapa
    }
  }

}

module.exports = StaffRequirementController
