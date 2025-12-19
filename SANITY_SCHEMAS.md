# Sanity Schemas Documentation

This document details all Sanity schemas and their configurations for the blog CMS.

## Table of Contents

- [Post Schema](#post-schema)
- [Tag Schema](#tag-schema)
- [Author Schema](#author-schema)
- [SiteSettings Schema](#sitesettings-schema)
- [Validation Rules](#validation-rules)
- [Query Examples](#query-examples)

---

## Post Schema

**File:** `sanity/schemaTypes/post.ts`

The Post schema defines the structure for blog articles with comprehensive SEO support, member-only content, and rich text editing.

### Fields

| Field              | Type      | Required | Notes                                                      |
| ------------------ | --------- | -------- | ---------------------------------------------------------- |
| **title**          | string    | ✓        | Post headline (3-200 chars)                                |
| **slug**           | slug      | ✓        | Auto-generated from title, must be lowercase with hyphens  |
| **excerpt**        | text      | ✓        | Short description for listings (10-300 chars)              |
| **body**           | array     | ✓        | Rich text with blocks, images, headings, lists, links      |
| **coverImage**     | image     | ✓        | Featured image with hotspot support                        |
| **tags**           | array     | ✓        | References to Tag documents (min 1)                        |
| **author**         | reference | ✓        | Reference to Author document                               |
| **publishedAt**    | datetime  | ○        | Required when status = "published"                         |
| **status**         | string    | ✓        | "draft" or "published" (default: draft)                    |
| **featured**       | boolean   | -        | Display in featured section (default: false)               |
| **membersOnly**    | boolean   | -        | Restrict to authenticated users (default: false)           |
| **seoTitle**       | string    | -        | Custom SEO title (≤60 chars, uses title if blank)          |
| **seoDescription** | string    | -        | Custom SEO description (≤160 chars, uses excerpt if blank) |
| **canonicalUrl**   | url       | -        | For republished or migrated content                        |

### Preview

In the Sanity Studio list view, posts display:

- **Title** with status indicator (✓ published / ○ draft)
- **Author name**
- **Featured indicator** (⭐)
- **Cover image** thumbnail

**Example preview:** `✓ Nikhil Nandyala ⭐ | Title of Post`

### Default Orderings

1. **Published Date (Newest)** - Default ordering, most recent first
2. **Published Date (Oldest)** - Oldest posts first
3. **Title (A-Z)** - Alphabetical ordering

### Rich Text Features

- **Styles:** Normal, H1, H2, H3, H4, Blockquote
- **Lists:** Bullet points, numbered lists
- **Marks:** Bold, italic, code, underline, strikethrough
- **Annotations:** Links with URL validation (http, https, mailto, tel)
- **Media:** Embedded images with hotspot cropping

---

## Tag Schema

**File:** `sanity/schemaTypes/tag.ts`

Tags are topics/categories for organizing and filtering blog posts.

### Fields

| Field     | Type   | Required | Notes                                                     |
| --------- | ------ | -------- | --------------------------------------------------------- |
| **title** | string | ✓        | Tag name (2-50 chars)                                     |
| **slug**  | slug   | ✓        | Auto-generated from title, must be lowercase with hyphens |

### Preview

In the Sanity Studio list view, tags display with a hashtag prefix:

- **Example:** `#Azure`, `#Networking`, `#DevOps`

### Usage

- Posts reference multiple tags to enable topic-based filtering
- Used for `/tags/[tag]` routes to show posts by category
- Enables blog taxonomy and navigation

---

## Author Schema

**File:** `sanity/schemaTypes/author.ts`

Author profiles provide byline information and author-specific pages.

### Fields

| Field     | Type   | Required | Notes                              |
| --------- | ------ | -------- | ---------------------------------- |
| **name**  | string | ✓        | Author name (2-100 chars)          |
| **image** | image  | ✓        | Profile photo with hotspot support |
| **bio**   | text   | ✓        | Author biography (10-500 chars)    |

### Preview

In the Sanity Studio list view, authors display:

- **Name** with profile image thumbnail

### Usage

- Referenced by Post documents for byline/attribution
- Used for author bio sections and author profile pages
- Enables `/authors/[author-id]` routes to show author's posts

---

## SiteSettings Schema

**File:** `sanity/schemaTypes/siteSettings.ts`

Global site configuration for SEO defaults and social media sharing.

### Fields

| Field                     | Type   | Required | Notes                                     |
| ------------------------- | ------ | -------- | ----------------------------------------- |
| **siteTitle**             | string | ✓        | Main site title (3-100 chars)             |
| **siteDescription**       | string | ✓        | Site description (20-300 chars)           |
| **defaultSeoTitle**       | string | ✓        | Default SEO title (≤60 chars)             |
| **defaultSeoDescription** | string | ✓        | Default SEO description (≤160 chars)      |
| **ogImage**               | image  | ✓        | Open Graph image (1200x630px recommended) |

### Preview

Studio displays: `Site Settings | Global SEO and metadata configuration`

### Usage

- Provides fallback SEO values when posts don't have custom ones
- Sets Open Graph image for social media sharing
- Single document in Sanity (singleton pattern)

**Important:** Only one SiteSettings document should exist in the database.

---

## Validation Rules

### Title & Slug

All titles require:

- Minimum 3-200 characters (varies by document type)
- Slugs must be lowercase with hyphens only
- Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`

Example valid slugs:

- `azure-networking`
- `devops-tutorial`
- `how-to-deploy`

Invalid slugs (will be rejected):

- `Azure Networking` (uppercase and spaces)
- `devops_tutorial` (underscores)
- `how to deploy` (spaces)

### Published Posts

- **publishedAt** datetime is required when status = "published"
- Draft posts don't require a publish date
- Helpful for scheduling content

### SEO Fields

- **seoTitle:** Max 60 characters (optimal for Google SERPs)
- **seoDescription:** Max 160 characters (optimal for Google SERPs)
- Leave blank to use post title/excerpt as fallback

### Rich Text Content

- **body:** Minimum 1 block required
- Supports mixed content (text, images, code blocks)
- Links validated for proper URL schemes

---

## Query Examples

### Fetch All Published Posts

```typescript
import { getPosts } from '@/sanity/client'

const posts = await getPosts({ status: 'published' })
```

### Fetch Featured Posts

```typescript
import { getFeaturedPosts } from '@/sanity/client'

const featured = await getFeaturedPosts(3) // Get 3 featured posts
```

### Fetch Single Post by Slug

```typescript
import { getPost } from '@/sanity/client'

const post = await getPost('azure-networking')
// Returns: {
//   _id, title, slug, excerpt, body, coverImage,
//   tags: [{title, slug}], author: {name, bio, image},
//   publishedAt, status, featured, membersOnly,
//   seoTitle, seoDescription, canonicalUrl
// }
```

### Fetch Posts by Tag

```typescript
import { getPostsByTag } from '@/sanity/client'

const posts = await getPostsByTag('azure')
```

### Fetch Posts by Author

```typescript
import { getPostsByAuthor } from '@/sanity/client'

const posts = await getPostsByAuthor(authorId)
```

### Fetch All Tags

```typescript
import { getTags } from '@/sanity/client'

const tags = await getTags()
```

### Fetch Site Settings

```typescript
import { getSiteSettings } from '@/sanity/client'

const settings = await getSiteSettings()
// Returns: {
//   siteTitle, siteDescription, defaultSeoTitle,
//   defaultSeoDescription, ogImage
// }
```

---

## File Structure

```
sanity/
├── schemaTypes/
│   ├── post.ts              # Post document schema
│   ├── tag.ts               # Tag document schema
│   ├── author.ts            # Author document schema
│   ├── siteSettings.ts      # Global settings schema
│   └── index.ts             # Schema exports
├── client.ts                # Sanity API client & queries
└── config.ts                # Sanity configuration
```

---

## Setup Notes

1. **Environment Variables** - Ensure `.env.local` contains:

   ```
   NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
   NEXT_PUBLIC_SANITY_DATASET=production
   ```

2. **Studio Access** - Navigate to `/studio` in development:

   ```bash
   npm run dev
   # Visit http://localhost:3000/studio
   ```

3. **Deployment** - Studio will be accessible at:
   ```
   https://yourdomain.com/studio
   ```

---

## Next Steps

1. ✅ Schemas created and validated
2. ⏳ Create Sanity project at https://sanity.io/manage
3. ⏳ Set environment variables in `.env.local`
4. ⏳ Start Studio: `npm run dev` → http://localhost:3000/studio
5. ⏳ Create first Author document
6. ⏳ Create Tags for organization
7. ⏳ Create first Post document
8. ⏳ Deploy to production

---

## Additional Resources

- [Sanity Documentation](https://www.sanity.io/docs)
- [GROQ Query Language](https://www.sanity.io/docs/groq)
- [Sanity CLI Reference](https://www.sanity.io/docs/cli)
- [Studio Customization](https://www.sanity.io/docs/structure)
