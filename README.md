## @champify/env

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

Then, you can use the generated context to access the environment variables.

```typescript
// In some other file
import { e } from './index.js';

const env = await e.init(['PORT', 'DATABASE_URL', 'API_KEY']);
```