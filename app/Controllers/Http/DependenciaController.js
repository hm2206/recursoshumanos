'use strict'

const Dependencia = use('App/Models/Dependencia');
const PerfilLaboral = use('App/Models/PerfilLaboral');
const { validation, ValidatorError } = require('validator-error-adonis');
const { validate } = use('Validator');

/**
 * Resourceful controller for interacting with dependencias
 */
class DependenciaController {
  /**
   * Show a list of all dependencias.
   * GET dependencias
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async index ({ request, response }) {
    let { page, query_search, type } = request.all();
    let dependencia = Dependencia.query();
    // filtro
    if (query_search) dependencia.whereRaw(`(nombre like '%${query_search}%' OR descripcion like '%${query_search}%')`);
    if (type) dependencia.where('type', '=', type);
    // get dependencia
    dependencia = await dependencia.paginate(page || 1, 20);
    // response 
    return {
      success: true,
      status: 201,
      dependencia
    }
  }

  /**
   * Create/save a new dependencia.
   * POST dependencias
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    await validation(validate, request.all(), {
      nombre: 'required|unique:dependencias',
      descripcion: 'required',
      ubicacion: 'required',
      type: 'required'
    });
    // guardar
    await Dependencia.create({
      nombre: request.input('nombre'),
      descripcion: request.input('descripcion'),
      ubicacion: request.input('ubicacion'),
      type: request.input('type')
    });
    // response 
    return {
      success: true,
      status: 201,
      message: "La dependencia se creó correctamente!"
    }
  }

  /**
   * Display a single dependencia.
   * GET dependencias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request }) {
    let dependencia = await Dependencia.find(params.id);
    if (!dependencia) throw new Error(`No se encontró la dependencia`);
    return {
      success: true,
      status: 201,
      dependencia
    }
  }

  /**
   * Render a form to update an existing dependencia.
   * GET dependencias/:id/edit
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async perfilLaboral ({ params, request }) {
    let { page, query_search } = request.all();
    let perfil_laboral = PerfilLaboral.query()
      .join('config_perfil_laborals as conf', 'conf.perfil_laboral_id', 'perfil_laborals.id')
      .where('conf.dependencia_id', params.id)
      .select('perfil_laborals.*')
    // filtro 
    if (query_search) perfil_laboral.whereRaw(`(nombre like '%${query_search}%' OR descripcion like '%${query_search}%')`);
    // paginate
    perfil_laboral = await perfil_laboral.paginate(page || 1, 20);
    // response 
    return {
      success: true,
      status: 201,
      perfil_laboral
    }
  }

  /**
   * Update dependencia details.
   * PUT or PATCH dependencias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    await validation(validate, request.all(), {
      nombre: 'required',
      descripcion: 'required',
      ubicacion: 'required',
      type: 'required'
    });
    // validar 
    let dependencia = await Dependencia.find(params.id);
    if (!dependencia) throw new Error(`No se encontró la dependencia`);
    // validar nombre
    let valName = await Dependencia.query()
      .where('nombre', '=', request.input('nombre'))
      .where('id', '<>', dependencia.id)
      .getCount('id');
    if (valName) throw new ValidatorError([ { field: 'nombre', message: `El nombre ya está en uso` } ]);
    // actualizar
    dependencia.nombre = request.input('nombre');
    dependencia.descripcion = request.input('descripcion')
    dependencia.ubicacion = request.input('ubicacion')
    dependencia.type = request.input('type');
    await dependencia.save();
    // response
    return {
      success: true,
      status: 201,
      message: "La dependencia se actualizó correctamente!"
    }
  }

  /**
   * Delete a dependencia with id.
   * DELETE dependencias/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
  }
}

module.exports = DependenciaController
