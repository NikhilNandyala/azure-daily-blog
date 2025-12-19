# 🚀 Sanity Studio Quickstart

Sanity Studio has been integrated into your Next.js blog. Follow these steps to get started.

## Step 1: Create a Sanity Project

Visit [sanity.io/manage](https://www.sanity.io/manage) and create a new project:

1. Sign up or log in to your Sanity account
2. Click "Create Project"
3. Choose a project name (e.g., "Azure Daily Blog")
4. Select "Single dataset" for simplicity
5. Accept defaults

You'll be given:

- **Project ID** (32-character string)
- **Dataset** name (usually "production")

## Step 2: Configure Environment Variables

Edit `.env.local` in your project root:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID_HERE
NEXT_PUBLIC_SANITY_DATASET=production
```

Replace `YOUR_PROJECT_ID_HERE` with your actual project ID from Sanity.

## Step 3: (Optional) Create API Token

For server-side content fetching, create an API token:

1. Go to [sanity.io/manage](https://www.sanity.io/manage) → Your Project → API
2. Click "Add API token"
3. Name it "azure-blog-api"
4. Set Role to "Editor"
5. Copy the token

Add to `.env.local`:

```bash
SANITY_API_TOKEN=your_token_here
```

## Step 4: Start Development Server

```bash
npm run dev
```

Then open:

- **Blog**: http://localhost:3000
- **Sanity Studio**: http://localhost:3000/studio

## Step 5: Sign In to Studio

1. Navigate to http://localhost:3000/studio
2. Click "Sign in with Sanity"
3. Use your Sanity account credentials
4. Grant permissions when asked

## Step 6: Create Your First Blog Post

In Sanity Studio:

1. Click "+ Create" button
2. Select "Blog Post"
3. Fill in the form:
   - **Title**: "My First Post"
   - **Slug**: "my-first-post" (auto-filled)
   - **Publish Date**: Today
   - **Summary**: A brief description
   - **Tags**: Add some tags (e.g., "azure", "tutorial")
   - **Content**: Write your post content
4. Click "Publish"

## Available Scripts

```bash
# Start dev server with Studio
npm run dev

# Build for production
npm run build

# Start production server
npm serve

# Deploy Studio to Sanity hosting (optional)
npm run sanity:deploy

# Lint code
npm run lint
```

## File Structure

```
sanity/
├── schemaTypes/          # Content schemas
│   ├── index.ts
│   └── blog.ts          # Blog post schema
├── client.ts            # Sanity client for fetching
└── README.md            # Sanity documentation

app/
├── studio/              # Studio pages
│   ├── page.tsx         # Studio entry point
│   ├── layout.tsx       # Studio layout
│   └── studio-wrapper.tsx
└── ...                  # Other app pages

sanity.config.ts         # Sanity configuration
SANITY_SETUP.md          # Detailed setup guide
```

## Fetching Content in Your App

Use the Sanity client in your components:

```typescript
import { client } from '@/sanity/client'

// In a server component or API route:
const posts = await client.fetch(`
  *[_type == "blog"] | order(date desc) {
    title,
    slug,
    date,
    summary,
    tags,
    membersOnly
  }
`)
```

## Studio Features

✅ **Blog Management**: Create, edit, publish posts  
✅ **Rich Fields**: Title, date, author, tags, content  
✅ **Access Control**: Members-only posts  
✅ **Organization**: Featured and pinned posts  
✅ **Preview**: Vision tool for GROQ queries  
✅ **Authentication**: Secure Sanity account login

## Next Steps

1. ✅ Create more blog posts in Studio
2. ✅ Connect Studio content to your Next.js pages
3. ✅ Deploy to Vercel (Studio works at `/studio` on your domain)
4. ✅ (Optional) Deploy Studio to Sanity's managed hosting
5. ✅ Add more schemas (authors, categories, etc.)

## Documentation

- [Sanity Docs](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Schema Types](https://www.sanity.io/docs/schema-types)
- [Full Setup Guide](./SANITY_SETUP.md)

## Troubleshooting

### "Missing environment variables"

Make sure both variables are in `.env.local`:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=xxxxx
NEXT_PUBLIC_SANITY_DATASET=production
```

### Studio won't load

- Clear browser cache
- Restart dev server: `Ctrl+C` then `npm run dev`
- Check browser console for errors

### Can't sign in

- Verify Sanity account credentials
- Make sure project is created on sanity.io
- Check that project ID in env is correct

Need help? Visit [slack.sanity.io](https://slack.sanity.io) for Sanity community support.
