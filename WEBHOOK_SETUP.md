# Sanity Webhook Setup for Automatic Revalidation

This guide explains how to configure Sanity webhooks to automatically update your Next.js site when content changes.

## Overview

The site uses **Incremental Static Regeneration (ISR)** with on-demand revalidation. When you publish or update content in Sanity, a webhook triggers Next.js to rebuild only the affected pages.

## Benefits

✅ **Instant updates**: New posts appear on homepage within seconds  
✅ **Efficient**: Only affected pages are rebuilt, not the entire site  
✅ **Automatic**: No manual deployments needed after publishing  
✅ **Tag sync**: Tags automatically update when posts or tags change

## Setup Instructions

### 1. Generate a Webhook Secret

```bash
# Generate a secure random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the generated string.

### 2. Add Environment Variable

In your deployment environment (Vercel), add:

```env
SANITY_REVALIDATE_SECRET=your_generated_secret_here
```

**Vercel:**

1. Go to your project dashboard
2. Settings → Environment Variables
3. Add `SANITY_REVALIDATE_SECRET` with your secret
4. Redeploy the site

### 3. Configure Sanity Webhook

1. Go to [Sanity Manage](https://www.sanity.io/manage)
2. Select your project
3. Navigate to **API** → **Webhooks**
4. Click **Create webhook**

#### Webhook Configuration:

**Name:** `Next.js Revalidation`

**URL:**

```
https://your-site.vercel.app/api/revalidate?secret=your_generated_secret_here
```

Replace:

- `your-site.vercel.app` with your actual domain
- `your_generated_secret_here` with the secret from step 1

**Dataset:** `production` (or your dataset name)

**Trigger on:**

- ✅ **Create**
- ✅ **Update**
- ✅ **Delete**

**Filter by document type:**

- ✅ `post`
- ✅ `tag`

**HTTP Method:** `POST`

**HTTP Headers:** _(leave default)_

**API version:** `v2021-06-07` (or latest)

#### Advanced (Optional):

**Projection:**

```groq
{
  _type,
  slug
}
```

This sends only the necessary data to the webhook.

**Save the webhook** ✅

### 4. Test the Webhook

#### Option A: Test in Sanity Studio

1. Go to your Sanity Studio (`/studio`)
2. Open any post
3. Make a small change (e.g., add a space to title)
4. Click **Publish**
5. Check the webhook log in Sanity dashboard
6. Verify your site updates within 30 seconds

#### Option B: Test via URL

```bash
curl "https://your-site.vercel.app/api/revalidate?secret=your_secret" \
  -X GET
```

You should see:

```json
{
  "revalidated": true,
  "now": 1703001234567,
  "message": "Manual revalidation completed"
}
```

## What Gets Revalidated

### When a `post` is created/updated/deleted:

- ✅ Homepage (`/`)
- ✅ Blog list page (`/blog`)
- ✅ Specific post page (`/blog/[slug]`)
- ✅ All tag pages (tags cache invalidated)

### When a `tag` is created/updated/deleted:

- ✅ Homepage (`/`) (for popular tags sidebar)
- ✅ Tags index page (`/tags`)
- ✅ Specific tag page (`/tags/[slug]`)

## Revalidation Times

Pages also revalidate automatically on a schedule:

- **Homepage**: Every 1 hour (`revalidate = 3600`)
- **Blog pages**: Every 24 hours (`revalidate = 86400`)
- **Tag pages**: Every 1 hour (`revalidate = 3600`)

Webhooks provide instant updates, while scheduled revalidation is a fallback.

## Troubleshooting

### Webhook not triggering

1. **Check Sanity webhook logs:**
   - Sanity Dashboard → API → Webhooks
   - Click your webhook → View delivery log
   - Look for HTTP 200 responses

2. **Verify secret matches:**
   - Check env var in Vercel matches webhook URL
   - No extra spaces or line breaks

3. **Check webhook URL:**
   - Must be publicly accessible (HTTPS)
   - Must include `?secret=` parameter
   - Try accessing URL in browser (should return 401 without secret)

### Updates not appearing

1. **Check revalidation is working:**

   ```bash
   curl "https://your-site.vercel.app/api/revalidate?secret=your_secret" -X GET
   ```

2. **Clear browser cache:**
   - Hard refresh: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)

3. **Check Vercel logs:**
   - Vercel Dashboard → Your Project → Logs
   - Look for revalidation messages

4. **Verify ISR is enabled:**
   - Check page includes `export const revalidate = 3600`

### 401 Unauthorized

- Secret mismatch between env var and webhook URL
- SANITY_REVALIDATE_SECRET not deployed to Vercel

### 500 Server Error

- Check Vercel function logs for error details
- Verify Next.js version supports `revalidatePath`

## Security Notes

⚠️ **Keep your webhook secret secure:**

- Never commit it to git
- Use different secrets for staging and production
- Rotate the secret if compromised

✅ **The webhook endpoint is protected:**

- Requires secret query parameter
- Validates against environment variable
- Returns 401 for invalid requests

## Manual Revalidation

If you need to force a revalidation:

```bash
# Revalidate all pages
curl "https://your-site.vercel.app/api/revalidate?secret=your_secret" -X GET
```

Or create a manual trigger in your Sanity Studio with a custom action.

## Testing Locally

1. Start dev server: `npm run dev`
2. Use ngrok to expose localhost:
   ```bash
   ngrok http 3000
   ```
3. Use the ngrok URL in Sanity webhook settings
4. Test by publishing a post in Sanity

**Note:** Local revalidation may not work exactly like production due to Next.js dev mode differences.

## Additional Resources

- [Next.js On-Demand Revalidation](https://nextjs.org/docs/app/building-your-application/data-fetching/incremental-static-regeneration)
- [Sanity Webhooks Documentation](https://www.sanity.io/docs/webhooks)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)

## Summary

Once configured:

1. ✅ Publish a post in Sanity
2. ✅ Webhook fires automatically
3. ✅ Next.js revalidates affected pages
4. ✅ Changes appear live within seconds

No manual deployments needed! 🎉
