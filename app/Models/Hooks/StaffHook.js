'use strict'

const Perfil = use('App/Models/PerfilLaboral');
const slugify = require('slugify')
const StaffRequirement = use('App/Models/StaffRequirement');
const uid = require('uid');

const StaffHook = exports = module.exports = {}

StaffHook.generateSlug = async (staff) => {
    if (staff.dirty.perfil_laboral_id != staff.perfil_laboral_id) {
        let perfil = await Perfil.find(staff.perfil_laboral_id);
        if (perfil) {
            staff.slug = slugify(`${perfil.nombre} ${staff.convocatoria_id} ${uid()}`, { lower: true });
        }
    }
}
