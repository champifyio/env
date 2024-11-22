> [!CAUTION]
> The public API for this package is still in active development and is not yet ready for production use.

# @champify/env [![NPM version](https://img.shields.io/npm/v/@champify/env.svg?style=flat-square)](https://www.npmjs.com/package/@champify/env)

@champify/env is a type-safe environment variable management tool for Node.js and TypeScript.

* [Install](#-installation)
* [Usage](#-usage)
* [Background](#-background)
* [A Note on API Stability](#-a-note-on-api-stability)
* [TypeScript](#-typescript)
* [License](#-license)

## Installation

```bash
npm install @champify/env
```

## Usage

```typescript
// In env.ts
import { Env } from '@champify/env';

// Define all env vars that your application needs.
const e = new Env({ vars: ['PORT', 'DATABASE_URL', 'API_KEY'] });
```

You can also define a callback function that will be called when an environment variable is not found. This is useful for logging or throwing an error.

```typescript
const e = new Env({ 
  vars: ['PORT', 'DATABASE_URL', 'API_KEY'],
  missingHandler: async (key: string) => {
    console.error(`Missing required env var: ${key}`);
  }
});
```

In each file, initialize only the environment variables you need within that file.

```typescript
import { e } from './env.js';

// Initialize only the environment variables that you need.
const env = await e.init(['PORT']);

// Access the environment variables with type safety
console.log(env.PORT);
```

If `PORT` is not defined in your `.env` file or in your production environment, your application will throw the following error at startup, preventing your application from silently failing.

```bash
Missing required env var: PORT (production)
```

You can also mark certain environment variables as optional, or required only in certain environments.

```typescript
const env = await e.init(['PORT', e.optional('API_KEY'), e.required('DATABASE_URL')]);
```

### Type Safety

If you try to initialize an environment variable that was not defined in the main list, your code will not compile.

```bash
src/error.ts:73:27 - error TS2322: Type '"OHNO_NOT_DEFINED"' is not assignable to type '"PORT" | "DATABASE_URL" | "API_KEY" | EnvVarDefinition<"PORT" | "DATABASE_URL" | "API_KEY">'.

73 const env = await e.init(['OHNO_NOT_DEFINED']);
                             ~~~~~~~~~~~~~~~~~~
```

Likewise, if you try to access an environment variable that was not initialized within the specific context, your code will also not compile.

```bash
src/index.ts:74:5 - error TS2339: Property 'DATABASE_URL' does not exist on type 'EnvVarContext<"PORT">'.

74 env.DATABASE_URL
       ~~~~~~~~~~~~
```

Type safety FTW.

## Background

There are several tools to ensure that `process.env` is populated with the environment variables defined in your `.env`. In fact, we use [dotenv](https://www.npmjs.com/package/dotenv) at [Champify](https://champify.io) but we found it was too easy to do all of the right things and still cause problems. For example, say you deployed code that did something like this (taken straight from the dotenv docs):

```typescript
require('dotenv').config();

s3.getBucketCors({Bucket: process.env.S3_BUCKET}, function(err, data) {});
```

If `S3_BUCKET` isn't defined in your `.env` file, you'll get a runtime error deep within application logic. This code might even be wrapped in an error handler that could potentially swallow the error and cause a silent failure.

Nothing we could find off the shelf provided a method to prevent these sorts of errors outright, so we built it ourselves.

`@champify/env` requires you to define all environment variables that your application uses in one place, making it easy to see what your application depends on. It also forces users to initialize only the environment variables that are needed within a specific file.

I could go on, but the best way to understand the benefits of @champify/env is to check it out for yourself.

## A Note on API Stability

This project is in active development, so it's possible there might be some changes before it hits v1.0.

That being said, we'll respect semver, so you can expect that any breaking changes will come with a new major version.

## TypeScript

This package is meant for use with TypeScript. If you're not using TypeScript, you might not get much out of this, since much of the benefit of using this package is in surfacing type errors at compile time.

## License

[Apache-2.0](./LICENSE)