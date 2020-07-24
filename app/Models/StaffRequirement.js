'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class StaffRequirement extends Model {

    static boot () {
        super.boot();

        // add hooks
        this.addHook('beforeCreate', 'StaffHook.generateSlug')
    }

}

module.exports = StaffRequirement
