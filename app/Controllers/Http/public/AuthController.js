'use strict'

const { validation, ValidatorError } = require('validator-error-adonis');
const { validate } = use('Validator');
const Postulante = use('App/Models/Postulante');
const Staff = use('App/Models/StaffRequirement');
const Etapa = use('App/Models/Etapa');
const DB = use('Database');
const random = require('random')
const Encryption = use('Encryption')
const Event = use('Event');
const moment = require('moment');

class AuthController {

    login = async ({ request }) => {
        // validar input
        await validation(validate, request.all(), {
            email: "required|email"
        });
        // validar cuenta
        let postulante = await Postulante.findBy('email', request.input('email'));
        if (!postulante) throw new ValidatorError([ {field: 'email', message: 'No se encontró el correo electrónico'} ])
        // generar codigo
        let code = random.int(100000, 999999);
        // guardar codigo cifrado
        postulante.token = await Encryption.encrypt(code);
        await postulante.save();
        // envidar code
        Event.fire('postulante::sendCode', request, postulante, code);
        // response 
        return {
            success: true,
            status: 201,
            message: 'El codigó de verificación fué generado'
        }
    }

    verification = async ({ request }) => {
        // validar input
        await validation(validate, request.all(), {
            email: "required|email",
            code: "required|min:6|max:6"
        });
        // validar cuenta
        let postulante = await Postulante.findBy('email', request.input('email'));
        if (!postulante) throw new Error("La cuenta de postulación no existe");
        if (!postulante.token) throw new Error("No se puede verificar la cuenta");
        // validar code
        let rawCode = await Encryption.decrypt(postulante.token);
        if (rawCode != request.input('code')) throw new ValidatorError([ {field: 'code', message: 'El código es incorrecto'} ]);
        // generar payload de sesión
        let payload = {
            iat: moment().valueOf(),
            exp: moment().add(1, 'd').valueOf(),
            id: postulante.id
        }
        // generar token
        let token = await Encryption.encrypt(payload);
        // eliminar code
        postulante.token = null;
        await postulante.save();
        // response 
        return {
            success: true,
            status: 201,
            message: "La sesión se creó correctamente",
            token
        }
    }

    me = async ({ request }) => {
        return {
            success: true,
            status: 201,
            postulante: request._postulante
        }
    }

    etapa = async ({ params, request }) => {
        let postulante = request._postulante;
        let etapa = await DB.table('staff_requirements as staff')
            .join('perfil_laborals as per', 'per.id', 'staff.perfil_laboral_id')
            .join('etapas as eta', 'eta.staff_id', 'staff.id')
            .where('eta.postulante_id', '=', postulante.id)
            .where('eta.current', '=', 1)
            .where('staff.slug', '=', params.slug)
            .select('staff.id', 'staff.slug', 'per.nombre', 'eta.estado', 'eta.puntaje', 'eta.current')
            .first();
        // response
        return {
            success: true,
            status: 201,
            etapa: etapa || {}
        }
    }

    my_postulacion = async ({ request }) => {
        let { page } = request.all();
        let postulante = request._postulante;
        let staff = await Staff.query()
          .join('dependencias as dep', 'dep.id', 'staff_requirements.dependencia_id')
          .join('perfil_laborals as per', 'per.id', 'staff_requirements.perfil_laboral_id')
          .join('etapas as eta', 'eta.staff_id', 'staff_requirements.id')
          .select(
            'staff_requirements.id', 'staff_requirements.slug', 'staff_requirements.estado', 
            'staff_requirements.fecha_inicio', 'staff_requirements.fecha_final', 
            'staff_requirements.honorarios',
            'dep.nombre as dependencia', 'per.nombre as perfil_laboral'
          )
            .where('eta.postulante_id', postulante.id)
            .groupBy(
                'staff_requirements.id', 'staff_requirements.slug', 'staff_requirements.estado', 
                'staff_requirements.fecha_inicio', 'staff_requirements.fecha_final', 
                'staff_requirements.honorarios', 'dep.nombre', 'per.nombre', 
            )
            .orderBy('staff_requirements.fecha_final', 'DESC')
            .paginate(page || 1, 20);
        // response 
        return {
          success: true,
          status: 201,
          staff
        }
    }

    postular = async ({ params, request }) => {
        let postulante = request._postulante;
        let staff = Staff.query()
            .where('id', params.id)
            .where('estado', 'PUBLICADO')
            .first();
        if (!staff) throw new Error(`La postuación ya está cerrada`);
        // get count etapas
        let etapa = await Etapa.query()
            .where('postulante_id', postulante.id)
            .where('staff_id', params.id)
            .getCount();
        // validar postulacion
        if (etapa) throw new Error("Usted ya se encuentra postulando");
        // generar postulación
        await Etapa.create({
            postulante_id: postulante.id,
            staff_id: params.id,
            current: 1,
            puntaje: 0,
            estado: 'CURRICULAR'
        });
        // response 
        return {
            success: true,
            status: 201,
            message: "Postulación exitosa!"
        }
    }

}   

module.exports = AuthController
