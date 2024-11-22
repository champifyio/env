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
// In index.ts
import { Env } from '@champify/env';

const e = new Env(['PORT', 'DATABASE_URL', 'API_KEY']);
```

Then, you can use this class to read your environment variables with type safety!

```typescript
import { e } from './index.js';

const env = await e.init(['PORT', 'DATABASE_URL', 'API_KEY']);

// Access the environment variables with type safety!
console.log(env.PORT);
```