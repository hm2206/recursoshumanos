'use strict'

const Perfil = use('App/Models/PerfilLaboral');
const slugify = require('slugify')
const StaffRequirement = use('App/Models/StaffRequirement');

const StaffHook = exports = module.exports = {}

StaffHook.generateSlug = async (staff) => {
    let perfil = await Perfil.find(staff.perfil_laboral_id);
    if (perfil) {
        staff.slug = slugify(`${perfil.nombre} ${staff.convocatoria_id}`, { lower: true });
    }
}
