'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

const PostulanteHook = require('./Hooks/PostulanteHook');

class Postulante extends Model {

    static get hidden () {
        return ['token']
      }

    static boot () {
        super.boot();

        // add hooks
        this.addHook('beforeSave', 'PostulanteHook.beforeSave')
    }

}

module.exports = Postulante
