import { factories } from '@strapi/strapi'

export default factories.createCoreController('api::venta-segura.venta-segura', ({ strapi }) => ({
    async find(ctx) {
        const secret = ctx.query.secret || ctx.request.body?.secret;

        // Verificamos que envíe el secret correcto (guardado en .env)
        if (secret !== process.env.ENTREGA_SECRET) {
            return ctx.unauthorized('No autorizado');
        }

        // Usamos el controller original para continuar con la consulta
        const { data, meta } = await super.find(ctx);
        return { data, meta };
    },
    async update(ctx) {
        const secret = ctx.query.secret || ctx.request.body?.secret;

        if (secret !== process.env.ENTREGA_SECRET) {
            return ctx.unauthorized('No autorizado');
        }

        return await super.update(ctx);
    }

}));