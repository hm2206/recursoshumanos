'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RequisitoSchema extends Schema {
  up () {
    this.create('requisitos', (table) => {
      table.increments()
      table.string("slug").unique();
      table.string("descripcion");
      table.json("body");
      table.integer("staff_id");
      table.timestamps()
    })
  }

  down () {
    this.drop('requisitos')
  }
}

module.exports = RequisitoSchema
