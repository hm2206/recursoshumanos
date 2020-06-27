'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StaffRequirementSchema extends Schema {
  up () {
    this.create('staff_requirements', (table) => {
      table.increments()
      table.string('slug').unique()
      table.integer('sede_id').notNullable()
      table.integer('dependencia_id').notNullable()
      table.integer('perfil_laboral_id').notNullable();
      table.integer('cantidad')
      table.decimal('honorarios', 10, 2).defaultTo(0);
      table.integer('meta_id');
      table.string('deberes').notNullable();
      table.string('fecha_inicio').notNullable();
      table.string('fecha_final').notNullable();
      table.json('bases').notNullable();
      table.integer('supervisora_id').notNullable();
      table.integer('convocatoria_id').notNullable();
      table.boolean('renovacion').defaultTo(false);
      table.enum('estado', ["CREADO", "PUBLICADO", "TERMINADO", "CANCELADO"]).defaultTo('CREADO');
      table.timestamps()
    })
  }

  down () {
    this.drop('staff_requirements')
  }
}

module.exports = StaffRequirementSchema
