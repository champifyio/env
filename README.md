## @champify/env

> [!CAUTION]
> The public API for this package is still in active development and is not yet ready for production use.

Type-safe environment variable management for Node.js.

### Motivation

There are several tools to ensure that `process.env` is populated with the environment variables defined in your `.env`. In fact, we use [dotenv](https://www.npmjs.com/package/dotenv) at [Champify](https://champify.io) but we found it was too easy to do all of the right things and still cause problems. For example, say you deployed code that did something like this (taken straight from the dotenv docs):

```typescript
require('dotenv').config();

s3.getBucketCors({Bucket: process.env.S3_BUCKET}, function(err, data) {});
```

If `S3_BUCKET` isn't defined in your `.env` file, you'll get a runtime error deep within application logic. This code might even be wrapped in an error handler that could potentially swallow the error and cause a silent failure.

Nothing we could find off the shelf provided a method to prevent these sorts of errors outright, so we built it ourselves.

`@champify/env` requires you to define all environment variables that your application uses in one place, making it easy to see what your application depends on. It also forces users to initialize only the environment variables that are needed within a specific file.

I could go on, but the best way to understand the benefits of `@champify/env` is to check out the examples below.

### Installation

```bash
npm install @champify/env
```

### Usage

```typescript
// In env.ts
import { Env } from '@champify/env';

// Define all env vars that your application needs.
const e = new Env(['PORT', 'DATABASE_URL', 'API_KEY'], async (key: string) => {
  // called when an environment variable is not found
  // e.g., metrics.log('Environment variable not found', { key });
});
```

Then, you can use this class to read your environment variables.

```typescript
import { e } from './env.js';

// Initialize only the environment variables that you need.
const env = await e.init(['PORT']);

// Access the environment variables with type safety
console.log(env.PORT);
```

### Type Safety



 you'll get a type error.

```bash
src/error.ts:73:27 - error TS2322: Type '"OHNO_NOT_DEFINED"' is not assignable to type '"PORT" | "DATABASE_URL" | "API_KEY" | EnvVarDefinition<"PORT" | "DATABASE_URL" | "API_KEY">'.

73 const env = await e.init(['OHNO_NOT_DEFINED']);
                             ~~~~~~~~~~~~~~~~~~
```

If you try to access an environment variable that was not initialized, you will also get a type error.

```bash
src/index.ts:74:5 - error TS2339: Property 'DATABASE_URL' does not exist on type 'EnvVarContext<"PORT">'.

74 env.DATABASE_URL
       ~~~~~~~~~~~~
```

### License

[Apache-2.0](./LICENSE)