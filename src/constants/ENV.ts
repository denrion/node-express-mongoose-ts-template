export const JWT_SECRET = process.env.JWT_SECRET ?? '';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? '';
export const JWT_COOKIE_EXPIRES_IN = +(process.env.JWT_COOKIE_EXPIRES_IN as string) ?? 0;

export const EMAIL_HOST = process.env.EMAIL_HOST ?? '';
export const EMAIL_PORT = +(process.env.EMAIL_PORT as string) ?? 0;
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME ?? '';
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD ?? '';

export const RATE_LIMIT_MAX_NUM_CONNECTIONS =
  +(process.env.RATE_LIMIT_MAX_NUM_CONNECTIONS as string) ?? 100;
export const RATE_LIMIT_KEEP_IN_MEMORY_LENGTH_MS =
  +(process.env.RATE_LIMIT_KEEP_IN_MEMORY_LENGTH_MS as string) ?? 60 * 60 * 1000;
