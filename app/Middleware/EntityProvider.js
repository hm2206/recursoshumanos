'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { authentication } = require('../Services/apis');

class EntityProvider {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    // get entityId
    let id = await this.getEntityId(request);
    // validar entity
    let { data } = await request.api_authentication.get(`auth/entity/${id}`);
    if (!data.id) throw new Error("No se encontró la entidad!");
    // inject entity
    request._entity = data;
    // call next to advance the request
    await next()
  }

  getEntityId = (request) => {
    return request.header('EntityId') || request.input('EntityId');
  }

}

module.exports = EntityProvider
