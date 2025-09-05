module.exports = ({ env }) => {
  const parse = require("pg-connection-string").parse;

  // If DATABASE_URL is provided, use it; otherwise fall back to individual env vars
  const config = env("DATABASE_URL")
    ? parse(env("DATABASE_URL"))
    : {
        host: env("DATABASE_HOST", "127.0.0.1"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "my-project"),
        user: env("DATABASE_USERNAME", "root"),
        password: env("DATABASE_PASSWORD", "123456"),
      };

  return {
    connection: {
      client: "postgres",
      connection: {
        ...config,
        ssl: env.bool("DATABASE_SSL", true),
      },
    },
  };
};
