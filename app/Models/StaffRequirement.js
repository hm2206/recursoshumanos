'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class StaffRequirement extends Model {

    static boot () {
        super.boot();

        // add hooks
        this.addHook('beforeSave', 'StaffHook.generateSlug')
    }

    convocatoria = () => {
        return this.belongsTo('App/Models/Convocatoria');
    }

    perfil_laboral = () => {
        return this.belongsTo('App/Models/PerfilLaboral');
    }

}

module.exports = StaffRequirement
