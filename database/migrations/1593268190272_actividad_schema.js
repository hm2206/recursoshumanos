'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ActividadSchema extends Schema {
  up () {
    this.create('actividads', (table) => {
      table.increments()
      table.string("descripcion").notNullable();
      table.string("fecha_inicio").notNullable();
      table.string('fecha_final').notNullable();
      table.string('responsable').notNullable();
      table.integer('convocatoria_id').notNullable();
      table.boolean("estado").defaultTo(true);
      table.timestamps()
    })
  }

  down () {
    this.drop('actividads')
  }
}

module.exports = ActividadSchema
