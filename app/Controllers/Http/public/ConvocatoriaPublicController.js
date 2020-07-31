'use strict'

const Convocatoria = use('App/Models/Convocatoria');
const Staff = use('App/Models/StaffRequirement');
const Actividad = use('App/Models/Actividad');

class ConvocatoriaPublicController {

  index = async ({ request }) => {
    let { page } = request.all();
    let convocatoria = Convocatoria.query()
      .where('estado', 'PUBLICADO')
    // get 
    convocatoria = await convocatoria.paginate(page || 1, 20);
    // response 
    return {
      success: true,
      code: 201,
      convocatoria
    }
  }

  staffRequirement = async ({ params, request }) => {
    let { page } = request.all();
    let staff = await Staff.query()
      .join('convocatorias as con', 'con.id', 'staff_requirements.convocatoria_id')
      .join('dependencias as dep', 'dep.id', 'staff_requirements.dependencia_id')
      .join('perfil_laborals as per', 'per.id', 'staff_requirements.perfil_laboral_id')
      .select('staff_requirements.*', 'dep.nombre as departamento', 'per.nombre as perfil_laboral')
      .where('con.id', params.id)
      .whereIn('staff_requirements.estado', ['PUBLICADO', 'TERMINADO'])
      .paginate(page || 1, 20);
    // response 
    return {
      success: true,
      status: 201,
      staff
    }
  }

  actividades = async ({ params, request }) => {
    let actividades = await Actividad.query()
      .join('convocatorias as con', 'con.id', 'actividads.convocatoria_id')
      .where('convocatoria_id', params.id)
      .whereIn('con.estado', ['PUBLICADO', 'TERMINADO'])
      .select('actividads.*')
      .fetch();
    // response
    return {
      success: true,
      status: 201,
      actividades
    }
  }

}

module.exports = ConvocatoriaPublicController
