# Sanity Studio Setup Guide

## Quick Start: Get Your Admin Panel Running in 5 Minutes

### Step 1: Create a Sanity Project

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Click **"Create Project"**
3. Choose a name for your project (e.g., "Azure Daily Blog")
4. Select **"Production"** as the dataset name
5. Copy the **Project ID** (looks like: `abc123de`)

### Step 2: Add Credentials to Your Project

Create a file named `.env.local` in your project root:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id-here
NEXT_PUBLIC_SANITY_DATASET=production
```

**Replace `your-project-id-here` with your actual Project ID from Step 1**

### Step 3: Start the Development Server

```powershell
npm run dev
```

### Step 4: Access Sanity Studio

Open your browser and go to:

```
http://localhost:3002/studio
```

You'll be prompted to sign in with your Sanity account (same account from Step 1).

---

## What You Can Do in Studio

### 📝 Create a Blog Post

1. Navigate to **Posts → All Posts**
2. Click **"+ Create"** button
3. Fill in the fields:
   - **Title**: Your blog post headline
   - **Slug**: Click "Generate" to auto-create from title
   - **Excerpt**: Short summary (10-300 characters)
   - **Body**: Rich text editor - write your content here
     - Add headings (H1, H2, H3)
     - Format text (bold, italic, code)
     - Insert links
     - Add images
   - **Cover Image**: Upload a featured image
   - **Tags**: Select existing tags (create them first in Tags section)
   - **Author**: Select author (create one first in Authors section)
   - **Status**: Choose "draft" or "published"
   - **Published At**: Set publication date/time
   - **Featured**: Toggle to show on homepage
   - **Members Only**: Toggle to restrict to logged-in users

4. Click **"Save"** to save as draft
5. Click **"Publish"** to make it live

### 🏷️ Create Tags

1. Navigate to **Tags**
2. Click **"+ Create"**
3. Fill in:
   - **Title**: Tag name (e.g., "Azure", "Networking")
   - **Slug**: Click "Generate"
4. Click **"Publish"**

### 👤 Create Authors

1. Navigate to **Authors**
2. Click **"+ Create"**
3. Fill in:
   - **Name**: Author's full name
   - **Profile Image**: Upload author photo
   - **Bio**: Short biography (10-500 characters)
4. Click **"Publish"**

### ⚙️ Configure Site Settings

1. Navigate to **Site Settings**
2. Fill in global settings:
   - **Site Title**: Your blog name
   - **Site Description**: Brief description of your blog
   - **Default SEO Title**: Fallback title for search engines
   - **Default SEO Description**: Fallback meta description
   - **Open Graph Image**: Default social sharing image (1200x630px)
3. Click **"Publish"**

---

## Studio Navigation

### Posts Section (Organized View)

- **All Posts**: See everything
- **Drafts**: Work-in-progress posts (not published)
- **Published**: Live posts on your site
- **Featured**: Posts marked as featured
- **Members Only**: Restricted content

### Status Indicators in Lists

- `✓` = Published post
- `○` = Draft post
- `⭐` = Featured post

---

## Draft → Publish Workflow

### Working with Drafts

1. Create a new post with **Status: "draft"**
2. Save frequently as you write
3. Don't set **Published At** date yet (optional for drafts)
4. Preview your work in the Studio

### Publishing a Post

1. Open your draft post
2. Change **Status** to **"published"**
3. Set **Published At** date/time
4. Review all required fields (title, slug, excerpt, body, cover image, tags, author)
5. Click **"Publish"**

### Unpublishing a Post

1. Open published post
2. Change **Status** back to **"draft"**
3. Click **"Save"**

---

## Common Tasks

### Edit Existing Content

1. Navigate to the appropriate section (Posts, Tags, Authors, Settings)
2. Click on the item you want to edit
3. Make your changes
4. Click **"Save"** or **"Publish"**

### Delete Content

1. Open the item
2. Click the three-dot menu (⋯) in the top right
3. Select **"Delete"**
4. Confirm deletion

### Duplicate a Post

1. Open the post
2. Click the three-dot menu (⋯)
3. Select **"Duplicate"**
4. Edit the duplicated post as needed

### Upload Images

- Click the **"Upload"** button in any image field
- Drag and drop, or browse for files
- Adjust hotspot (focal point) by clicking and dragging
- Images are automatically optimized by Sanity

---

## Studio Keyboard Shortcuts

- `Ctrl+S` / `Cmd+S`: Save document
- `Ctrl+Alt+P` / `Cmd+Opt+P`: Publish document
- `Ctrl+\` / `Cmd+\`: Toggle sidebar
- `Esc`: Close current pane

---

## Connecting Your Frontend to Sanity Content

After creating content in Studio, you need to update your Next.js pages to fetch from Sanity instead of Contentlayer.

### Example: Fetch Posts on Homepage

```typescript
// app/page.tsx
import {getPublishedPosts} from '@/sanity/client'

export default async function HomePage() {
  const posts = await getPublishedPosts()

  return (
    <div>
      {posts.map((post) => (
        <article key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <a href={`/blog/${post.slug.current}`}>Read more</a>
        </article>
      ))}
    </div>
  )
}
```

### Example: Fetch Single Post

```typescript
// app/blog/[slug]/page.tsx
import {getPost} from '@/sanity/client'
import {PortableText} from '@portabletext/react'

export default async function PostPage({params}: {params: {slug: string}}) {
  const post = await getPost(params.slug)

  if (!post) return <div>Post not found</div>

  return (
    <article>
      <h1>{post.title}</h1>
      <img src={post.coverImage} alt={post.title} />
      <PortableText value={post.body} />
    </article>
  )
}
```

---

## Troubleshooting

### "Studio won't load" / "Config error"

- Check that `.env.local` exists in project root
- Verify Project ID is correct (no quotes, no spaces)
- Restart dev server: `Ctrl+C`, then `npm run dev`

### "Failed to fetch" errors in Studio

- Check your internet connection
- Verify you're signed into Sanity in your browser
- Check Sanity project exists at [sanity.io/manage](https://www.sanity.io/manage)

### "Can't create content"

- Sign in to Studio (should prompt automatically)
- Ensure you have Editor/Admin permissions on the Sanity project
- Check dataset name matches `.env.local` (usually "production")

### "Changes not appearing on site"

- Content is in Sanity, but frontend still uses Contentlayer by default
- You need to update your Next.js pages to fetch from Sanity (see examples above)
- Consider installing `@portabletext/react` for rich text rendering:
  ```powershell
  npm install @portabletext/react
  ```

---

## Next Steps

1. ✅ Set up `.env.local` with your Project ID
2. ✅ Access Studio at `http://localhost:3002/studio`
3. ✅ Create your first Author
4. ✅ Create some Tags
5. ✅ Create your first Post (draft)
6. ✅ Publish the post
7. ✅ Configure Site Settings
8. Update frontend pages to fetch from Sanity
9. Deploy to production (Studio will be at `yourdomain.com/studio`)

---

## Production Deployment

When you deploy your site (Vercel, Netlify, etc.), make sure to add environment variables:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

The Studio will automatically be available at `yourdomain.com/studio` and you can manage content from anywhere!

---

## Need Help?

- Sanity Documentation: [sanity.io/docs](https://www.sanity.io/docs)
- Next.js + Sanity Guide: [sanity.io/guides/nextjs](https://www.sanity.io/guides/nextjs)
- Studio Issues: Check browser console (F12) for error messages
