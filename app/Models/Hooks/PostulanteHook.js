'use strict'

const PostulanteHook = exports = module.exports = {}

PostulanteHook.beforeSave = async (postulante) => {
    postulante.nombre_completo = `${postulante.ape_paterno} ${postulante.ape_materno} ${postulante.nombres}`.toLowerCase();
    postulante.ape_paterno = `${postulante.ape_paterno}`.toLowerCase()
    postulante.ape_materno = `${postulante.ape_materno}`.toLowerCase()
    postulante.nombres = `${postulante.nombres}`.toLowerCase();
}