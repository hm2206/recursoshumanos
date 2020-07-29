'use strict'

const Staff = use('App/Models/StaffRequirement');
const Dependencia = use('App/Models/Dependencia');
const Requisito = use('App/Models/Requisito');

class StaffRequirementPublicController {

  show = async ({ params, request }) => {
    let staff = await Staff.query()
      .with('perfil_laboral')
      .with('convocatoria')
      .where('slug', '=', params.slug)
      .whereIn('estado', ['PUBLICADO', 'TERMINADO'])
      .first();
    if (!staff) throw new Error(`No se encontró el requerimiento de personal`);
    // setting bases
    staff = await staff.toJSON();
    staff.bases = JSON.parse(staff.bases);
    // response 
    return {
      success: true,
      status: 201,
      staff
    }
  }

  dependencia = async ({ params, request }) => {
    let dependencia= await Dependencia.query()
      .join('staff_requirements as staff', 'staff.dependencia_id', 'dependencias.id')
      .whereIn('staff.estado', ['PUBLICADO', 'TERMINADO'])
      .first();
    // response 
    return {
      success: true,
      status: 201,
      dependencia
    }
  }

  requisitos = async ({ params }) => {
    let requisitos = await Requisito.query()
      .join('staff_requirements as staff', 'staff.id', 'requisitos.staff_id')
      .where('staff.slug', params.slug)
      .whereIn('staff.estado', ['PUBLICADO', 'TERMINADO'])
      .fetch();
    // convertir bodies
    requisitos = await requisitos.toJSON();
    await requisitos.map(req => {
      req.body = JSON.parse(req.body);
      return req;
    });
    // response
    return {
      success: true,
      status: 201,
      requisitos
    }
  }

}

module.exports = StaffRequirementPublicController
