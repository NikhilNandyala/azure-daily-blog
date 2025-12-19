# Sanity Schemas Quick Reference

## Schema Overview

| Schema           | Fields    | Purpose              | Notes                                 |
| ---------------- | --------- | -------------------- | ------------------------------------- |
| **Post**         | 13 fields | Blog articles        | Rich text, SEO, member-only, featured |
| **Tag**          | 2 fields  | Content categories   | Topics for organizing posts           |
| **Author**       | 3 fields  | Author profiles      | Name, image, bio                      |
| **SiteSettings** | 5 fields  | Global configuration | SEO defaults, OG image (singleton)    |

---

## Post Schema Quick Guide

### Required Fields (must fill in Studio)

```
- Title                    (3-200 characters)
- Slug                     (auto from title, lowercase-hyphens)
- Excerpt                  (10-300 characters)
- Body                     (rich text, minimum 1 block)
- Cover Image             (image upload)
- Tags                     (minimum 1 tag)
- Author                   (select from Author list)
- Status                   (Draft or Published)
```

### Optional Fields (but recommended)

```
- Published At             (required when Published)
- Featured                 (checkbox for featured section)
- Members Only             (checkbox for restricted posts)
- SEO Title               (override title for search)
- SEO Description         (override excerpt for search)
- Canonical URL           (for republished content)
```

### Body Rich Text Options

- **Headings:** H1-H4
- **Lists:** Bullets, numbered
- **Text Marks:** Bold, italic, code, underline, strikethrough
- **Links:** External/internal URLs
- **Images:** Embedded with hotspot cropping

---

## Tag Schema Quick Guide

### Required Fields

```
- Title                    (2-50 characters)
- Slug                     (auto from title, lowercase-hyphens)
```

**Example Tags:**

- Azure
- Networking
- DevOps
- Troubleshooting
- Tutorial

---

## Author Schema Quick Guide

### Required Fields

```
- Name                     (2-100 characters)
- Image                    (profile photo upload)
- Bio                      (10-500 characters)
```

---

## SiteSettings Schema Quick Guide

### Required Fields (Single Document)

```
- Site Title              (3-100 characters)
- Site Description        (20-300 characters)
- Default SEO Title       (≤60 characters)
- Default SEO Description (≤160 characters)
- Open Graph Image        (1200x630px recommended)
```

**Note:** Only ONE SiteSettings document should exist. It provides fallback values for posts that don't have custom SEO values.

---

## Studio Workflows

### Creating a New Post

1. In Studio, click **"+ Create"** → **"Post"**
2. Enter **Title** (auto-generates slug)
3. Enter **Excerpt** (for listings)
4. Upload **Cover Image**
5. Click into **Body** and write content
   - Use rich text editing (headings, lists, formatting)
   - Embed images inline as needed
6. Select **Tags** (can create inline)
7. Select **Author**
8. Set **Status** to "Draft" or "Published"
9. If published, set **Published At** date
10. Check **Featured** if for home page
11. Check **Members Only** if restricted
12. Click **Publish**

### Creating Tags

1. Click **"+ Create"** → **"Tag"**
2. Enter **Title** (e.g., "Azure")
3. Slug auto-generates (e.g., "azure")
4. Click **Publish**

### Creating Authors

1. Click **"+ Create"** → **"Author"**
2. Enter **Name**
3. Upload **Image** (profile photo)
4. Enter **Bio**
5. Click **Publish**

### Configuring Site Settings

1. Click **"+ Create"** → **"Site Settings"**
2. Fill in all required fields
3. Upload **Open Graph Image** (for social sharing)
4. Click **Publish**
5. **Note:** This is a singleton—only create one document

---

## Validation Rules

### Slug Format

- ✅ Valid: `azure-networking`, `devops-tutorial`, `how-to-deploy`
- ❌ Invalid: `Azure Networking`, `devops_tutorial`, `how to deploy`

### SEO Best Practices

- **Title:** 50-60 characters for optimal display
- **Description:** 150-160 characters for optimal display
- Leave custom SEO fields blank to use post title/excerpt

### Rich Text

- Body must have at least 1 block
- Links must be valid URLs or email addresses
- Images can be embedded inline within text

### Status & Publishing

- **Draft:** Can save without publish date
- **Published:** Must have a publish date set

---

## Client Functions

```typescript
// Get all published posts (sorted by date)
getPosts({status: 'published'})

// Get featured posts
getFeaturedPosts(limit: number)

// Get single post by slug
getPost(slug: string)

// Get posts by tag
getPostsByTag(tagSlug: string)

// Get posts by author
getPostsByAuthor(authorId: string)

// Get all tags
getTags()

// Get all authors
getAuthors()

// Get site settings
getSiteSettings()
```

---

## Environment Variables

```bash
# Required in .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=your-32-char-id
NEXT_PUBLIC_SANITY_DATASET=production

# Optional for API token (write access)
SANITY_API_TOKEN=your-api-token
```

---

## Common Tasks

### Change a Post Status from Draft to Published

1. Open the post in Studio
2. Change **Status** to "Published"
3. Set **Published At** if not already set
4. Click **Publish**

### Delete a Post

1. Open the post in Studio
2. Click the **⋯ (More)** menu
3. Select **Delete**
4. Confirm deletion

### Edit a Published Post

1. Open the post in Studio
2. Make changes to any fields
3. Click **Publish** (Studio auto-saves)

### Create a Featured Post

1. Create/edit a post normally
2. Check the **Featured** checkbox
3. Click **Publish**
4. Post will appear on home page

### Restrict Post to Members

1. Create/edit a post normally
2. Check the **Members Only** checkbox
3. Click **Publish**
4. Post requires authentication to view

---

## Troubleshooting

### Post not appearing in Studio list

- Ensure you clicked **Publish**
- Check that Status is not "Draft" (unless filtering for drafts)
- Verify the document has all required fields

### Slug validation error

- Remove spaces, use hyphens instead
- Use lowercase letters and numbers only
- Can't start or end with hyphens
- Pattern: `[a-z0-9]+(?:-[a-z0-9]+)*`

### Can't reference Author/Tag

- Ensure Author/Tag document is published first
- Create them before referencing in posts
- Can also create inline while editing a post

### SEO fields not visible

- Scroll down in the editor
- They're optional (below the main content)
- Leave blank to use title/excerpt

---

## File Locations

```
sanity/schemaTypes/
├── post.ts              ← Post schema (13 fields)
├── tag.ts               ← Tag schema (2 fields)
├── author.ts            ← Author schema (3 fields)
├── siteSettings.ts      ← Settings schema (5 fields)
└── index.ts             ← Schema exports

sanity/client.ts         ← Query helper functions
sanity.config.ts         ← Main Sanity config
app/studio/              ← Studio routes
├── page.tsx
├── layout.tsx
└── studio-wrapper.tsx
```

---

## Next Steps

1. ✅ **Schemas created** - All 4 schemas ready
2. ⏳ **Create Sanity project** - https://sanity.io/manage
3. ⏳ **Set environment variables** - Update `.env.local`
4. ⏳ **Start Studio** - `npm run dev` → `/studio`
5. ⏳ **Create content** - Authors → Tags → Posts
6. ⏳ **Deploy** - Push to production

---

## Support

For detailed documentation, see:

- `SANITY_SCHEMAS.md` - Full field reference
- `SANITY_SETUP.md` - Installation & configuration
- `README_SANITY.md` - Getting started guide
