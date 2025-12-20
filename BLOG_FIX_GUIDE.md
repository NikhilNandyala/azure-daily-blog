# Blog 404 Fix - Root Cause Analysis

## Problem Summary

Blog links return 404 and no posts appear on the blog listing page.

## Root Cause

The blog uses **Sanity CMS** as its content source, but Sanity environment variables are **not configured** in the production environment (Vercel). This causes:

1. **Empty Blog List**: `getAllPublishedPosts()` returns `[]` when Sanity is not configured
2. **No Static Pages Generated**: `generateStaticParams()` returns `[]`, so no `/blog/[slug]` pages are built
3. **404 Errors**: All blog post URLs return 404 because no pages were statically generated

## How the Blog Works

### Content Source

- **Primary**: Sanity CMS (cloud-based headless CMS)
- **Legacy**: MDX files in `data/blog/` (leftover from Contentlayer, **not currently used**)

### Route Structure

```
app/blog/
├── page.tsx                 # Blog listing (/blog)
├── [...slug]/page.tsx       # Individual posts (/blog/post-slug)
└── page/[page]/page.tsx     # Pagination (/blog/page/2)
```

### How Posts Are Fetched

1. **Blog List** (`app/blog/page.tsx`):
   - Calls `getAllPublishedPosts(limit, offset)` from `lib/sanity/queries.ts`
   - Query: `*[_type == "post" && status == "published"] | order(publishedAt desc)`
   - Returns empty array if Sanity not configured

2. **Individual Posts** (`app/blog/[...slug]/page.tsx`):
   - Uses catch-all route `[...slug]`
   - `generateStaticParams()` calls `getAllPostSlugs()` from `lib/sanity/queriesDraft.ts`
   - Query: `*[_type == "post" && status == "published"] { slug }`
   - Returns `{ slug: [item.current] }` for each post
   - `getPostBySlug()` fetches post content

### Link Generation

```tsx
href={`/blog/${post.slug.current}`}
```

This generates URLs like: `/blog/my-post-slug`

### Route Matching

- Route: `app/blog/[...slug]/page.tsx`
- Params: `{ slug: ['my-post-slug'] }` (array)
- Code accesses: `params.slug[0]`

## Required Environment Variables

### Production (Vercel)

Must be set in Vercel dashboard → Project Settings → Environment Variables:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_DRAFT_TOKEN=your_draft_token  # Optional, for draft preview
NEXTAUTH_SECRET=your_nextauth_secret  # Already set
```

### Local Development (.env.local)

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_DRAFT_TOKEN=your_draft_token
NEXTAUTH_SECRET=your_nextauth_secret
```

## How to Get Sanity Credentials

1. **Go to Sanity.io**: https://www.sanity.io/manage
2. **Select Your Project** (or create one if you don't have one)
3. **Get Project ID**:
   - Dashboard → Settings → API
   - Copy the Project ID
4. **Get Dataset Name**:
   - Usually "production" or "development"
   - Found in Settings → Datasets
5. **Generate Draft Token** (optional):
   - Settings → API → Tokens
   - Click "Add API token"
   - Name: "Draft Preview Token"
   - Permissions: "Viewer"
   - Copy the token

## Fix Steps

### Step 1: Configure Sanity in Vercel

1. Go to Vercel dashboard
2. Select your project
3. Settings → Environment Variables
4. Add:
   - `NEXT_PUBLIC_SANITY_PROJECT_ID` = your project ID
   - `NEXT_PUBLIC_SANITY_DATASET` = production
5. Redeploy the site

### Step 2: Add Content in Sanity

1. Go to your Sanity Studio: `/studio` route on your site
   - Or: `https://your-site.vercel.app/studio`
2. Create posts with:
   - Title
   - Slug (auto-generated from title)
   - Content (body)
   - **Status: "published"** ← CRITICAL
   - Published Date
3. Click "Publish"

### Step 3: Verify Locally

```powershell
# Set environment variables in .env.local
# Then:
npm run build
npm run start
```

Visit:

- http://localhost:3000/blog → Should show published posts
- http://localhost:3000/debug/posts → Debug page showing all posts
- http://localhost:3000/blog/your-post-slug → Should open post

### Step 4: Verify in Production

After Vercel deployment completes:

1. Visit https://your-site.vercel.app/debug/posts
2. Check that posts are listed
3. Click post links to verify they work
4. Check blog listing page shows posts

## Debugging

### No Posts Showing?

1. **Check Debug Page**: `/debug/posts`
   - Shows: Total posts, published count, draft count
   - Lists all slugs and expected URLs
   - Shows Sanity configuration status

2. **Check Sanity Studio**:
   - Visit `/studio`
   - Verify posts have `status = "published"`
   - Check that `publishedAt` date is set
   - Verify slug is set correctly

3. **Check Query**:
   ```groq
   *[_type == "post" && status == "published"]
   ```

   - Must have `_type: "post"`
   - Must have `status: "published"` (not "draft")
   - Should have `publishedAt` date

### Still Getting 404s?

1. **Check Build Logs**:
   - Look for "Generating static paths for /blog/[...slug]"
   - Should show list of generated paths
   - If empty, `generateStaticParams()` returned no slugs

2. **Check ISR Revalidation**:
   - Pages revalidate every 24 hours (`export const revalidate = 86400`)
   - Force rebuild in Vercel: Deployments → ⋯ → Redeploy

3. **Check Slug Format**:
   - Slug should be lowercase, hyphen-separated
   - No special characters except hyphens
   - Example: `my-first-post`, `azure-networking-guide`

## Technical Details

### generateStaticParams Format

```tsx
// Correct format for [...slug] catch-all route
return slugs.map((item) => ({
  slug: [item.current], // Array with single element
}))

// Example output:
// [
//   { slug: ['my-post'] },
//   { slug: ['another-post'] }
// ]
```

### Post Filtering Logic

```tsx
// In lib/sanity/queries.ts
const query = `
  *[_type == "post" && status == "published"]
  | order(publishedAt desc)
  [${offset}...${offset + limit}] {
    ${POST_LIST_FIELDS}
  }
`
```

- Filters: `_type == "post"` AND `status == "published"`
- Sorts: By `publishedAt` descending (newest first)
- Paginates: Using `[offset...offset+limit]` slice

## Current Status

✅ **Fixed**:

- Sanity client initialization (no crashes without env vars)
- All query functions return safe defaults
- Image URL builder handles missing config
- Studio shows configuration message
- Created `/debug/posts` diagnostic page

⚠️ **Requires Action**:

- Set Sanity environment variables in Vercel
- Add content in Sanity Studio
- Redeploy site after env vars are set

## Files Modified

### Created:

- `app/debug/posts/page.tsx` - Diagnostic page

### Previously Modified (for graceful degradation):

- `lib/sanity/client.ts` - Returns null if not configured
- `lib/sanity/draftClient.ts` - Returns null if token missing
- `lib/sanity/getClient.ts` - Null-safe client getter
- `lib/sanity/getSiteSettings.ts` - Null-safe settings
- `lib/sanity/imageUrl.ts` - Lazy initialization
- `lib/sanity/queries.ts` - All queries return empty arrays
- `sanity.config.ts` - Uses placeholder values
- `app/studio/studio-wrapper.tsx` - Shows config message

## Next Steps

1. **Immediate**: Configure Sanity environment variables in Vercel
2. **Add Content**: Create posts in Sanity Studio with status="published"
3. **Verify**: Check `/debug/posts` page after deployment
4. **Test**: Click blog links to verify no 404s
5. **Optional**: Import MDX content from `data/blog/` into Sanity if needed
