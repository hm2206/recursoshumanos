'use strict'

const Postulante = use('App/Models/Postulante')
const { validate } = use('Validator')
const { ValidatorError } = require('validator-error');


class PostulanteController {

  index = async ({ request, response }) => {

  }

  store = async ({ request, response }) => {
    // validar request
    const validation = await validate(request.all(), {
      ape_paterno: "required|max:100",
      ape_materno: "required|max:100",
      nombres: "required|max:100",
      tip_de_documento: "required|min:2|max:2",
      numero_de_documento: "required|min:8|max:12",
      ubigeo_id: "required",
      fecha_de_nacimiento: "required|date",
      phone: "required|min:9|numeric|max:12",
      email: "required|email|max:100"
    });
    if (validation.fails()) throw new ValidatorError(validation.messages());
    // procesar
    try {
      return {
        success: true,
        code: 201,
        message: "Los datos se guardarón correctamente!"
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
