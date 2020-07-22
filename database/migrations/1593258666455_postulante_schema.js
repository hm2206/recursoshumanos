'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostulanteSchema extends Schema {
  up () {
    this.create('postulantes', (table) => {
      table.increments()
      table.enum('tipo_de_documento', ['01', '04', '07', '09']).defaultTo('01');
      table.string("numero_de_documento").unique();
      table.string("ape_paterno").notNullable();
      table.string("ape_materno").notNullable();
      table.string("nombres").notNullable();
      table.string("nombre_completo").notNullable();
      table.string("fecha_de_nacimiento").notNullable();
      table.enum('genero', ['M', 'F', 'I']).default('I')
      table.string('ubigeo_id').notNullable();
      table.string('direccion').notNullable();
      table.string("phone").notNullable();
      table.string("email").notNullable();
      table.string("cv").nullable();
      table.string('imagen').nullable();
      table.string('token').nullable();
      table.boolean('estado').defaultTo(1);
      table.timestamps()
    })
  }

  down () {
    this.drop('postulantes')
  }
}

module.exports = PostulanteSchema
