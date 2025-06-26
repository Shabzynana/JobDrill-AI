export const configuration = () => ({
  port: parseInt(process.env.APP_PORT, 10) || 3456,
  appRoot: process.cwd(),
  hostname: process.env.APP_HOSTNAME || '0.0.0.0',
  host: process.env.APP_HOST || `http://localhost:${process.env.APP_PORT || 3456}`,
  app: process.env.APP_URL || `http://localhost:${process.env.APP_PORT || 3000}`,
  apiPrefix: process.env.API_PREFIX || 'api',

  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN,
  },

  Queue: {
    url: process.env.REDIS_URL,
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    user: process.env.REDIS_USERNAME,
    pass: process.env.REDIS_PASS,
    db: process.env.REDIS_DB,
  },

  groq: {
    apiKey: process.env.GROQ_API_KEY,
    transcription_url: process.env.GROQ_TRANSCRIPTION_URL,
  },
});
