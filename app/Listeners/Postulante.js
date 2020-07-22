'use strict'

const Postulante = exports = module.exports = {}
const Env = use('Env');

Postulante.registered = async (request, postulante, link) => {
    await request.api_authentication.post('mail/to', {
        from: request._system.email,
        email: postulante.email,
        header: `Registro Exitoso del Postulante`,
        username: `${postulante.nombres}`.toUpperCase(),
        contenido: `Ahora ya puedes postular a una oferta laboral`,
        subject: `Bienvenido ${`${postulante.nombres}`.toUpperCase()}`,
        link,
        btn: "Verificar Cuenta"
    });
}
