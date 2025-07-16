module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'", 'data:', 'blob:',
            'https://*.cloudinary.com',  // permite PNG/JPG/etc
            'https://res.cloudinary.com'
          ],
          'media-src': [
            "'self'", 'data:', 'blob:',
            'https://*.cloudinary.com',  // permite reproducir como imagen
            'https://res.cloudinary.com'
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
