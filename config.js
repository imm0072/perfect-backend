module.exports = {
  PORT: process.env.PORT ?? 5000,
  DB: process.env.DB ?? "mongodb://localhost:27017/",
  SALT_ROUNDS: parseInt(process.env.SALT_ROUNDS ?? 10),
  BCRYPT_PEPPER: process.env.BCRYPT_PEPPER ?? "default_pepper",
  JWT_SECRET_KEY_ACCESS_KEY:
    process.env.JWT_SECRET_KEY_ACCESS_KEY ?? "JWT_SECRET_KEY_ACCESS_KEY",
  JWT_SECRET_KEY_REFRESH_KEY:
    process.env.JWT_SECRET_KEY_REFRESH_KEY ?? "JWT_SECRET_KEY_REFRESH_KEY",
  TOKEN_HASH_SECRET: process.env.TOKEN_HASH_SECRET ?? "TOKEN_HASH_SECRET",
};
