## @champify/env

> [!CAUTION]
> The public API for this package is still in active development and is not yet ready for production use.

Type-safe environment variable management for Node.js.

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

Then, you can use this class to read your environment variables with type safety!

```typescript
import { e } from './env.js';

// Initialize only the environment variables that you need.
const env = await e.init(['PORT']);

// Throws a type error because 'RANDOM_VAR' is not defined in the Env constructor.
// const env = await e.init(['RANDOM_VAR']);

// Access the environment variables with type safety!
console.log(env.PORT);

// Throws a type error because 'DATABASE_URL' was not initialized.
// console.log(env.DATABASE_URL);
```