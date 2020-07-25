'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class EtapaSchema extends Schema {
  up () {
    this.create('etapas', (table) => {
      table.increments()
      table.integer('postulante_id');
      table.integer('staff_id');
      table.integer('current').default(1);
      table.decimal('puntaje', 10, 2).default(0);
      table.enum('estado', ['CURRICULAR', 'CONOCIMIENTO', 'ENTREVISTA', 'GANADOR']);
      table.unique(['postulante_id', 'personal_id', 'estado']);
      table.timestamps()
    })
  }

  down () {
    this.drop('etapas')
  }
}

module.exports = EtapaSchema
