# Draft Preview Setup Guide

This guide explains how to set up draft preview support for your Sanity-powered blog.

## Environment Variables

Add these variables to your `.env.local` file:

```dotenv
# Existing variables
NEXT_PUBLIC_SANITY_PROJECT_ID=c0qlwbxu
NEXT_PUBLIC_SANITY_DATASET=production

# Draft mode configuration
# Generate a secure token for draft previews (use a strong random string)
SANITY_DRAFT_SECRET_TOKEN=your-secret-token-here

# Sanity read token for accessing draft documents
# Must have "read" permissions on your Sanity project
SANITY_DRAFT_TOKEN=your-sanity-read-token-here

# Optional: Your site URL for canonical URLs
NEXT_PUBLIC_SITE_URL=https://azuredailyblog.com
```

## Getting Sanity Read Token

1. Go to Sanity Dashboard → Settings → API
2. Create a new token with **Read** permissions only
3. Name it something like "Draft Preview Read Token"
4. Copy and paste the token into `SANITY_DRAFT_TOKEN`

## API Routes

Two API routes are available:

### Enable Draft Mode

```
GET /api/draft/enable?secret=<token>&slug=<post-slug>
POST /api/draft/enable?secret=<token>&slug=<post-slug>
```

Enables draft mode and redirects to the post preview.

**Example:**

```
https://azuredailyblog.com/api/draft/enable?secret=your-secret-token&slug=my-draft-post
```

### Disable Draft Mode

```
GET /api/draft/disable
POST /api/draft/disable
```

Disables draft mode and redirects to blog listing.

## Sanity Studio Integration

In Sanity Studio, configure a preview webhook:

1. Go to Studio Settings → Plugins
2. Search for "Preview URL"
3. Set up preview URL pattern:

```
https://your-site.com/api/draft/enable?secret=your-secret-token&slug=<slug>
```

This allows creators to preview posts directly from Sanity Studio with the "Preview" button.

## How It Works

### Architecture

1. **Client Selection**: `getSanityClient()` returns either:
   - `client` (published perspective) - for normal visitors
   - `draftClient` (previewDrafts perspective) - when draft mode is enabled

2. **Draft Mode Detection**: Uses Next.js `draftMode()` from headers
   - Only server-side (never exposed to browsers)
   - Must be enabled via `/api/draft/enable`

3. **Token Security**:
   - `SANITY_DRAFT_SECRET_TOKEN` protects the `/api/draft/enable` endpoint
   - `SANITY_DRAFT_TOKEN` is server-side only (never exposed to browser)
   - Both tokens are environment variables (never committed to git)

### Query System

- **Published**: `getAllPublishedPosts()` - only published posts
- **Draft & Published**: `getPostBySlug(client, slug)` - includes drafts when using draftClient

All queries accept a `client` parameter to support both perspectives.

### Preview Banner

When draft mode is enabled:

- Yellow banner appears at top of page
- Shows "Preview Mode Enabled" with exit button
- Draft badge appears on draft posts
- Page padding adjusts to account for fixed banner

## Usage Scenarios

### Scenario 1: Preview from Sanity Studio

1. Sanity creator saves a draft post
2. Clicks "Preview" button in Studio
3. Browser opens: `/api/draft/enable?secret=...&slug=my-post`
4. API enables draft mode, redirects to `/blog/my-post`
5. Post displays with draft banner
6. Creator reviews content
7. Clicks "Exit Preview" to return to normal view

### Scenario 2: Manual Preview Link

Generate preview link to share with team:

```
https://azuredailyblog.com/api/draft/enable?secret=your-token&slug=azure-storage-tips
```

### Scenario 3: Disable Draft Mode

Either:

- Click "Exit Preview" button in banner
- Visit: `https://azuredailyblog.com/api/draft/disable`

## Security Best Practices

1. **Token Strength**: Use long, random, cryptographically secure tokens
2. **Token Rotation**: Rotate `SANITY_DRAFT_SECRET_TOKEN` regularly
3. **Scope Limitation**: `SANITY_DRAFT_TOKEN` should have read-only permissions
4. **HTTPS Only**: Always use HTTPS in production
5. **URL Secrets**: Don't log or expose preview URLs with tokens
6. **Environment Variables**: Never commit tokens to git

## Testing

### Local Testing

```bash
# Start dev server
npm run dev

# Enable draft mode
curl "http://localhost:3000/api/draft/enable?secret=test-token&slug=test-post"

# Disable draft mode
curl "http://localhost:3000/api/draft/disable"
```

### Production Testing

```bash
# With real secret token
curl "https://yourdomain.com/api/draft/enable?secret=REAL_TOKEN&slug=test-post"
```

## Troubleshooting

### Draft posts not showing

- Check `SANITY_DRAFT_TOKEN` is valid
- Verify token has "read" permissions
- Ensure post `status` field is set to "draft"
- Check browser cookies for draft mode flag

### Preview URL not working

- Verify `SANITY_DRAFT_SECRET_TOKEN` matches in route
- Check slug matches Sanity slug exactly
- Ensure post exists in Sanity
- Check browser console for errors

### Can't see draft banner

- Verify draft mode was enabled (check cookies)
- Clear browser cache/cookies
- Try incognito window
- Check `DraftModeBanner` is rendered in layout

## Files Modified

- `/app/api/draft/enable/route.ts` - Enable draft mode endpoint
- `/app/api/draft/disable/route.ts` - Disable draft mode endpoint
- `/lib/sanity/draftClient.ts` - Draft mode Sanity client configuration
- `/lib/sanity/getClient.ts` - Client selector based on draft mode
- `/lib/sanity/queriesDraft.ts` - GROQ queries with client parameter
- `/components/DraftModeBanner.tsx` - Visual indicator component
- `/app/blog/[...slug]/page.tsx` - Blog page with draft mode support

## Next Steps

1. Add environment variables to `.env.local`
2. Obtain Sanity read token from dashboard
3. Configure Studio preview webhook
4. Test preview functionality
5. Deploy to production with environment variables set
