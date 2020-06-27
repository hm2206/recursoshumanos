'use strict'

const Postulante = use('App/Models/Postulante')
const { validate } = use('Validator')
const { validation } = require('validator-error');


class PostulanteController {

  index = async ({ request, response }) => {
    return 'ok';
  }

  store = async ({ request, response }) => {
    // validar request
    await validation(validate, request.all(), {
      ape_paterno: "required|max:100",
      ape_materno: "required|max:100",
      nombres: "required|max:100",
      tipo_de_documento: "required|min:2|max:2",
      numero_de_documento: "required|min:8|max:12|unique:postulantes",
      ubigeo_id: "required",
      fecha_de_nacimiento: "required|date",
      phone: "required|min:9|number|max:12",
      email: "required|email|max:100|unique:postulantes"
    });
    // procesar
    try {
      // crear postulante
      let postulante = await Postulante.create({
        ape_paterno: request.input('ape_paterno'),
        ape_materno: request.input('ape_materno'),
        nombres: request.input('nombres'),
        tipo_de_documento: request.input('tipo_de_documento'),
        numero_de_documento: request.input('numero_de_documento'),
        ubigeo_id: request.input('ubigeo_id'),
        fecha_de_nacimiento: request.input('fecha_de_nacimiento'),
        phone: request.input('phone'),
        email: request.input('email')
      })
      return {  
        success: true,
        code: 201,
        message: "Los datos se guardarón correctamente!",
        postulante: postulante
      }
    } catch (error) {
      return {
        success: false,
        code: 501,
        message: error.message
      }
    }
  }

  update = async ({ request, response }) => {

  }

  destroy = async ({ requst, response}) => {

  }

}

module.exports = PostulanteController
