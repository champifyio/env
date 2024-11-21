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

const generateEnv = Env(['PORT', 'DATABASE_URL', 'API_KEY']);
```

Then, you can use the generated context to access the environment variables.

```typescript
// In some other file
import { generateEnvContext } from './index';

// This will throw an error if the environment variables are not set
const env = await generateEnv(['PORT', 'DATABASE_URL', 'API_KEY']);
```