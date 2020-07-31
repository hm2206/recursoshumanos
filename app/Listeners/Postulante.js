'use strict'

const Postulante = exports = module.exports = {}

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



Postulante.sendCode = async (request, postulante, code) => {
    await request.api_authentication.post('mail/to', {
        from: request._system.email,
        email: postulante.email,
        header: `Código de Verificación`,
        username: `Code: ${code}`,
        contenido: `copie el código e ingrese a postular`,
        subject: `Código de verificación de ${postulante.email}`
    });
}