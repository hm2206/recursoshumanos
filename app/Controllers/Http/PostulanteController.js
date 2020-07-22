'use strict'

const Postulante = use('App/Models/Postulante')
const { validate } = use('Validator')
const { validation, ValidatorError } = require('validator-error-adonis');
const moment = require('moment');
const Event = use('Event');


class PostulanteController {

  index = async ({ request, response }) => {
    let { page, query_search, sort } = request.all();
    let postulantes = Postulante.query();
    // filtro 
    if (query_search) postulantes.where('nombre_completo', 'like', `%${query_search}%`)
    // ordenamiento
    postulantes.orderBy('nombre_completo', sort == 'ASC' || sort == 'DESC' ? sort : 'ASC');
    // response 
    return await postulantes.paginate(page || 1, 20);
  }

  store = async ({ request, response }) => {
    // validar request
    await validation(validate, request.all(), {
      tipo_de_documento: "required|min:2|max:2",
      numero_de_documento: "required|min:8|max:12|unique:postulantes",
      ape_paterno: "required|max:100",
      ape_materno: "required|max:100",
      nombres: "required|max:100",
      fecha_de_nacimiento: "required|date",
      genero: "required|min:1|max:1",
      ubigeo_id: "required",
      direccion: "required|max:100",
      phone: "required|min:9|number|max:12",
      email: "required|email|max:100|unique:postulantes",
      redirect: "required|url"
    });
    // procesar
    try {
      // validar edad
      let year_current = moment().diff(request.input('fecha_de_nacimiento'), 'years');
      if (year_current < 18) throw new ValidatorError([ { field: 'fecha_de_nacimiento', message: 'La fecha de nacimiento es invalidad!' } ]); 
      // crear postulante
      let postulante = await Postulante.create({
        tipo_de_documento: request.input('tipo_de_documento'),
        numero_de_documento: request.input('numero_de_documento'),
        ape_paterno: request.input('ape_paterno'),
        ape_materno: request.input('ape_materno'),
        nombres: request.input('nombres'),
        fecha_de_nacimiento: request.input('fecha_de_nacimiento'),
        genero: request.input('genero'),
        ubigeo_id: request.input('ubigeo_id'),
        direccion: request.input('direccion'),
        fecha_de_nacimiento: request.input('fecha_de_nacimiento'),
        phone: request.input('phone'),
        email: request.input('email')
      })
      // generar token
      let token = 123456789;
      let params = JSON.stringify({
        token: token,
        data: "TUPLA 8888"
      });
      // link
      let link = `${request.input('redirect')}&params=${params}`;
      // send event
      Event.fire('postulante::registered', request, postulante, link);
      // response
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

  update = async ({ params, request, response }) => {
    let { id } = params;
    await validation(validate, request.all(), {
      email: `required|unique:postulantes,email,email,${request.input('email' || "")}`,
      ubigeo_id: "required|min:6|max:10",
      phone: "required|min:9|max:12" 
    });
    // procesar
    try {
      let postulante = await Postulante.find(id);
      // validar postulante
      if (!postulante) throw new Error('El postulante no existe!');
      // guardar los datos
      postulante.email = request.input('email', ""),
      postulante.ubigeo_id = request.input('ubigeo_id', ""),
      postulante.phone = request.input('phone', "");
      await postulante.save();
      // response 
      return {
        success: true,
        code: 201, 
        message: "Los datos se actualizarón correctamente!"
      }
    } catch (error) {
      return {
        success: false,
        code: 501,
        message: error.message
      }
    }
  }

  destroy = async ({ params, request, response}) => {
    try {
      let { id } = params;
      let postulante = await Postulante.find(id);
      // validar postulante
      if (!postulante) throw new Error('El postulante no existe!');
      // deshabilitar estado
      postulante.estado = false;
      await postulante.save();
      // response 
      return {
        success: true,
        code: 201,
        message: "El postulante fué deshabilitado correctamente!"
      };
    } catch (error) {
      return {
        success: false,
        code: 501,
        message: error.message
      }
    }
  }

}

module.exports = PostulanteController
