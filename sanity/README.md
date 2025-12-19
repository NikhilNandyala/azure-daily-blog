# Sanity Studio

Sanity Studio for managing blog content.

## Environment Variables

Create a `.env.local` file in the root directory with:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
```

## Getting Started

1. **Create a Sanity project** (if you haven't already):

   ```bash
   npx sanity@latest init
   ```

2. **Run Sanity Studio locally**:

   ```bash
   npm run dev
   ```

   Then navigate to `http://localhost:3000/studio`

3. **Deploy Studio**:
   ```bash
   npm run sanity:deploy
   ```

## Features

- **Blog Management**: Create, edit, and publish blog posts
- **Members-Only Posts**: Flag posts as restricted content for authenticated users
- **Featured & Pinned Posts**: Highlight important content
- **Tags**: Organize posts by topic
- **Rich Text**: Full markdown and code block support
- **Vision Tool**: Query Sanity data with GROQ

## Available Scripts

- `npm run dev` - Start Next.js dev server (includes Studio)
- `npm run sanity:deploy` - Deploy Studio to Sanity hosting
- `npm run sanity:build` - Build Studio for production

## Connecting to Frontend

The Studio is integrated into the Next.js app at `/studio`. To fetch content from Sanity in your Next.js components:

```typescript
import { client } from '@/sanity/client'

const posts = await client.fetch(`
  *[_type == "blog"] | order(date desc)
`)
```

## Documentation

- [Sanity Docs](https://www.sanity.io/docs)
- [Schema Types](https://www.sanity.io/docs/schema-types)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
