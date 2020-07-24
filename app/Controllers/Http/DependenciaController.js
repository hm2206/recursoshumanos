'use strict'

const Dependencia = use('App/Models/Dependencia');
const PerfilLaboral = use('App/Models/PerfilLaboral');

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
    let { page, query_search } = request.all();
    let dependencia = Dependencia.query();
    // filtro
    if (query_search) dependencia.whereRaw(`(nombre like '%${query_search}%' OR descripcion like '%${query_search}%')`);
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
  async show ({ params, request, response, view }) {
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
