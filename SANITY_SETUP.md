# Sanity Studio Setup Guide

This document walks through setting up Sanity CMS for the Azure Daily Blog.

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- A Sanity account (free tier available at https://sanity.io)

## Quick Start

### 1. Create a Sanity Project

If you don't have a Sanity project yet:

```bash
npm run sanity:init
```

This will:

- Prompt you to create a new Sanity project
- Set up authentication
- Create your project ID and dataset

### 2. Configure Environment Variables

Copy the example and fill in your credentials:

```bash
cp .env.sanity.example .env.local
```

Edit `.env.local` with your Sanity project details:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token-for-server-side-queries
```

Get these values from:

1. Project ID: [https://manage.sanity.io](https://manage.sanity.io) → Your project
2. API Token: [https://manage.sanity.io](https://manage.sanity.io) → API → Add API token (with "Editor" role)

### 3. Start Development Server

```bash
npm run dev
```

Then navigate to:

- **Studio**: http://localhost:3000/studio
- **Blog**: http://localhost:3000/blog

### 4. Admin Access

The Studio requires Sanity authentication:

1. Click "Sign in with Sanity"
2. Use your Sanity account credentials
3. Grant necessary permissions

## Managing Content

### Create a Blog Post

1. Open http://localhost:3000/studio
2. Click "Blog Post" in the sidebar
3. Click "Create"
4. Fill in the fields:
   - **Title**: Post headline
   - **Slug**: Auto-generated URL slug
   - **Publish Date**: When post should appear
   - **Summary**: Short description
   - **Tags**: Categorize content
   - **Content**: Full post text (supports markdown)
   - **Members Only**: Restrict to authenticated users
   - **Featured**: Show on featured section
   - **Pinned**: Pin to top of listings

5. Click "Publish" to go live

### Access Control

By default, all Studio users need Sanity authentication. For additional control:

1. Go to [https://manage.sanity.io](https://manage.sanity.io) → API
2. Create new API tokens with specific roles:
   - **Editor**: Can read/write documents
   - **Viewer**: Read-only access
3. Assign users and their permission levels

## Deployment

### Deploy Studio to Sanity Hosting

```bash
npm run sanity:deploy
```

This will:

- Build Studio for production
- Deploy to Sanity's CDN
- Provide a public URL (e.g., https://YOUR_PROJECT.sanity.studio)

### Deploy with Next.js

Your Next.js app already includes Studio at `/studio`:

1. Deploy Next.js normally (Vercel, etc.)
2. Studio will be available at `your-domain.com/studio`
3. Requires authentication via Sanity account

## Fetching Content in Next.js

### Server-Side (Recommended)

```typescript
import { client } from '@/sanity/client'

async function getPosts() {
  const posts = await client.fetch(`
    *[_type == "blog"] | order(date desc) {
      title,
      slug,
      date,
      membersOnly
    }
  `)
  return posts
}
```

### Client-Side

```typescript
import {client} from '@/sanity/client'
import {useEffect, useState} from 'react'

export default function BlogList() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    client.fetch(`*[_type == "blog"]`).then(setPosts)
  }, [])

  return (
    <ul>
      {posts.map((post) => (
        <li key={post._id}>{post.title}</li>
      ))}
    </ul>
  )
}
```

## File Structure

```
sanity/
├── schemaTypes/
│   ├── index.ts       # Schema exports
│   └── blog.ts        # Blog document type
├── plugins/           # Custom plugins (optional)
├── client.ts          # Sanity client setup
└── README.md          # Studio documentation

app/
└── studio/
    ├── page.tsx       # Studio root page
    └── layout.tsx     # Studio layout
```

## Common Tasks

### Change Dataset Name

1. Go to [https://manage.sanity.io](https://manage.sanity.io)
2. Select your project
3. Go to Settings → Datasets
4. Update `NEXT_PUBLIC_SANITY_DATASET` in `.env.local`

### Add Custom Field to Blog Schema

Edit `sanity/schemaTypes/blog.ts`:

```typescript
defineField({
  name: 'customField',
  title: 'Custom Field',
  type: 'string',
})
```

Restart Studio to see changes.

### Query Data with Vision Tool

In Studio, open the Vision tab (bottom right):

```
*[_type == "blog"] | order(date desc) {
  title,
  slug,
  _createdAt,
  _updatedAt
}
```

## Troubleshooting

### "Project not found" Error

- Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` is correct
- Check project exists at [https://manage.sanity.io](https://manage.sanity.io)

### Authentication Issues

- Clear browser cookies/cache
- Sign out and sign back in
- Check API token permissions in Sanity settings

### Studio Won't Load

- Ensure environment variables are set
- Restart dev server: `Ctrl+C` then `npm run dev`
- Check browser console for errors

## Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Schema Types Reference](https://www.sanity.io/docs/schema-types)
- [Sanity Community Slack](https://slack.sanity.io)

## Next Steps

1. Create your first blog post in Studio
2. Update content fetching in Next.js components
3. Test the end-to-end flow
4. Deploy to production
