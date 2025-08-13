import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::avisos-comunitario.avisos-comunitario', ({ strapi }) => ({

  async find(ctx) {
    const user = ctx.state.user;
    const secret = ctx.query.secret || ctx.request.body?.secret;

    if (!user && secret !== process.env.ENTREGA_SECRET) {
      return ctx.unauthorized('No autorizado');
    }

    const { data, meta } = await super.find(ctx);
    return { data, meta };
  },

  async findOne(ctx) {
    const user = ctx.state.user;
    const secret = ctx.query.secret || ctx.request.body?.secret;

    if (!user && secret !== process.env.ENTREGA_SECRET) {
      return ctx.unauthorized('No autorizado');
    }

    return await super.findOne(ctx);
  },

  async update(ctx) {
    const user = ctx.state.user;
    const secret = ctx.query.secret || ctx.request.body?.secret;

    if (!user && secret !== process.env.ENTREGA_SECRET) {
      return ctx.unauthorized('No autorizado');
    }

    return await super.update(ctx);
  },

}));
