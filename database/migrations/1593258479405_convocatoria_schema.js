'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ConvocatoriaSchema extends Schema {
  up () {
    this.create('convocatorias', (table) => {
      table.increments()
      table.string("numero_de_convocatoria").unique();
      table.text("observacion");
      table.string('fecha_inicio');
      table.string('fecha_final');
      table.integer('entity_id').notNullable();
      table.enum('estado', ['CREADO', 'PUBLICADO', 'CANCELADO', 'TERMINADO']).defaultTo('CREADO');
      table.timestamps()
    })
  }

  down () {
    this.drop('convocatorias')
  }
}

module.exports = ConvocatoriaSchema
