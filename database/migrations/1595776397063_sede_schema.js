'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SedeSchema extends Schema {
  up () {
    this.create('sedes', (table) => {
      table.increments()
      table.string('descripcion')
      table.string('direccion')
      table.string('ubigeo');
      table.timestamps()
    })
  }

  down () {
    this.drop('sedes')
  }
}

module.exports = SedeSchema
