'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const Postulante = use('App/Models/Postulante')
const Encryption = use('Encryption')

class Jwt {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    // obtener header
    let token = request.header('AuthConvocatoria');
    if (!token) throw Error('No se pudó obtener el token');
    // decifrar payload
    let payload = await Encryption.decrypt(token);
    let postulante = await Postulante.find(payload.id || '_error');
    if (!postulante) throw new Error('La cuenta es invalidad');
    request._postulante = postulante;
    // call next to advance the request
    await next()
  }
}

module.exports = Jwt
