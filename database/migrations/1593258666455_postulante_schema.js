'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostulanteSchema extends Schema {
  up () {
    this.create('postulantes', (table) => {
      table.increments()
      table.integer("person_id");
      table.string("email").unique();
      table.string('password').notNullable();
      table.string("token_verify");
      table.boolean("estado").defaultTo(1);
      table.timestamps()
    })
  }

  down () {
    this.drop('postulantes')
  }
}

module.exports = PostulanteSchema
