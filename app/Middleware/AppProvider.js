'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const { authentication } = require('../Services/apis');
const { getClient, getAuthorization } = require('../Services/tools');

class AppProvider {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, response }, next) {
    // configurar axios 
    await authentication.config(getClient(request));
    await authentication.config(getAuthorization(request));
    // validar app
    let { data } = await authentication.get(`app/me`);
    if (!data.success) return response.send(data);
    // inject app
    request._app = data.app;
    request.api_authentication = authentication;
    // call next to advance the request
    await next()
  }
}

module.exports = AppProvider
