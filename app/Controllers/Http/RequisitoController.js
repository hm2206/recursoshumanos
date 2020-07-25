'use strict'

const Requisito = use('App/Models/Requisito');
const { validation, ValidatorError } = require('validator-error-adonis');
const { validate } = use('Validator');
const uid = require('uid');

class RequisitoController {

    store = async ({ request }) => {
        await validation(validate, request.all(), {
            descripcion: 'required',
            body: 'required',
            staff_id: 'required' 
        });
        let requisito = await Requisito.create({ 
            slug: uid(),
            descripcion: request.input('descripcion'),
            body: request.input('body'),
            staff_id: request.input('staff_id')
        });
        // response 
        return {
            success: true,
            status: 201,
            code: 'SUCCESS_SAVE',
            message: "El requisito se guardó correctamente!",
            requisito
        }
    }

}

module.exports = RequisitoController
