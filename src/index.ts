export type EnvVarContext<T extends string> = Record<T, string>;

export type EnvVarDefinition<T extends string> = {
  key: T;
  handler: (x: string | undefined) => Promise<string>;
};

// eslint-disable-next-line no-restricted-syntax
export const getNodeEnv = () => process.env.NODE_ENV || 'development';
export const isProduction = () => getNodeEnv() === 'production';
export const isTest = () => getNodeEnv() === 'test';

export const throwIfMissing = async (key: string, value: string | null | undefined) => {
  const NODE_ENV = getNodeEnv();
  if (!value) {
    if (NODE_ENV === 'production') {

    }
    throw new Error(`Missing required env var ${key} (${NODE_ENV})`);
  }
  return value;
};

export const optional = <T extends string>(key: T, fallback = '') => ({
  key,
  handler: (value: string | null | undefined) => Promise.resolve(value || fallback),
});

export const optionalInDevelopment = <T extends string>(key: T, fallback = '') => ({
  key,
  handler: (value: string | null | undefined) =>
    ['development', 'test', 'prodreadonly'].includes(getNodeEnv())
      ? Promise.resolve(value || fallback)
      : throwIfMissing(key, value),
});

export const required = <T extends string>(key: T) => ({
  key,
  handler: (value: string | undefined) => throwIfMissing(key, value),
});

const _generateEnvContext = async <T extends string>(
  envVars: ReadonlyArray<T | EnvVarDefinition<T>>,
): Promise<EnvVarContext<T>> => {
  const context: Partial<EnvVarContext<T>> = {};

  for (const envVar of envVars) {
    if (typeof envVar === 'string') {
      // eslint-disable-next-line no-restricted-syntax
      context[envVar] = await throwIfMissing(envVar, process.env[envVar]);
    } else {
      const { key, handler } = envVar;
      // eslint-disable-next-line no-restricted-syntax
      context[key] = await handler(process.env[key]);
    }
  }

  return context as EnvVarContext<T>;
};

export const Env = <T extends string>(
  definedEnvVars: ReadonlyArray<T | EnvVarDefinition<T>>,
) => (env: ReadonlyArray<T | EnvVarDefinition<T>>) => _generateEnvContext(env);