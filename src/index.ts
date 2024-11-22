export type EnvVarContext<T extends string> = Record<T, string>;

export type EnvVarDefinition<T extends string> = {
  key: T;
  handler: (x: string | undefined) => Promise<string>;
};

// eslint-disable-next-line no-restricted-syntax
export const getNodeEnv = () => process.env.NODE_ENV || 'development';
export const isProduction = () => getNodeEnv() === 'production';
export const isTest = () => getNodeEnv() === 'test';

export class Env<U extends string> {
  private throwHandler: null | ((key: string) => Promise<void>);

  constructor(_: ReadonlyArray<U | EnvVarDefinition<U>>, throwHandler?: (key: string) => Promise<void> ) {
    this.throwHandler = throwHandler ?? null;
  }

  init = async <T extends U>(env: ReadonlyArray<T | EnvVarDefinition<T>>): Promise<EnvVarContext<T>> => {
    const context: Partial<EnvVarContext<T>> = {};

    for (const envVar of env) {
      if (typeof envVar === 'string') {
        // eslint-disable-next-line no-restricted-syntax
        context[envVar] = await this.throwIfMissing(envVar, process.env[envVar]);
      } else {
        const {key, handler} = envVar;
        // eslint-disable-next-line no-restricted-syntax
        context[key] = await handler(process.env[key]);
      }
    }

    return context as EnvVarContext<T>;
  }

  throwIfMissing = async (key: string, value: string | null | undefined) => {
    const NODE_ENV = getNodeEnv();
    if (!value) {
      if (this.throwHandler) {
        await this.throwHandler(key)
      }
      throw new Error(`Missing required env var ${key} (${NODE_ENV})`);
    }
    return value;
  };

  optional = <T extends string>(key: T, fallback = '') => ({
    key,
    handler: (value: string | null | undefined) => Promise.resolve(value || fallback),
  });

  optionalInDevelopment = <T extends string>(key: T, fallback = '') => ({
    key,
    handler: (value: string | null | undefined) =>
      ['development', 'test', 'prodreadonly'].includes(getNodeEnv())
        ? Promise.resolve(value || fallback)
        : this.throwIfMissing(key, value),
  });

  required = <T extends string>(key: T) => ({
    key,
    handler: (value: string | undefined) => this.throwIfMissing(key, value),
  });
}

