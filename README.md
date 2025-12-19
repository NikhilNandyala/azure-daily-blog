# Azure Daily Blog

A modern, feature-rich technical blog focused on Azure, networking, and cloud infrastructure. Built with Next.js 15, Sanity CMS, and Tailwind CSS.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 🚀 Features

- **Sanity CMS Integration** - Headless CMS for easy content management
- **Draft Preview Mode** - Preview draft posts before publishing
- **Authentication** - Google OAuth and credentials-based auth via NextAuth.js
- **Members-Only Content** - Restrict posts to authenticated users
- **Embedded Sanity Studio** - Manage content directly at `/studio`
- **SEO Optimized** - Dynamic metadata and JSON-LD schemas
- **Responsive Design** - Mobile-first design with Tailwind CSS
- **Dark Mode** - Built-in dark mode support
- **Tag System** - Organize posts with tags and categories
- **Search Functionality** - Fast client-side search
- **RSS Feed** - Auto-generated RSS feed
- **Analytics Ready** - Ready for Google Analytics integration

## 📋 Table of Contents

- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Content Management](#-content-management)
- [Adding Blog Posts](#-adding-blog-posts)
- [Creating New Pages](#-creating-new-pages)
- [Customization](#-customization)
- [Deployment](#-deployment)
- [Project Structure](#-project-structure)

## 🛠 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **CMS**: [Sanity v4](https://www.sanity.io/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Language**: TypeScript
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Sanity account ([sign up free](https://www.sanity.io/))
- Google OAuth credentials (for authentication)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/NikhilNandyala/azure-daily-blog.git
   cd azure-daily-blog
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up Sanity**

   ```bash
   npm install -g @sanity/cli
   sanity init
   ```

   - Follow the prompts to create a new project
   - Note your Project ID and Dataset name

4. **Configure environment variables**

   Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

   Fill in your environment variables (see [Environment Variables](#-environment-variables))

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Access the application**
   - Website: `http://localhost:3000`
   - Sanity Studio: `http://localhost:3000/studio`

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_write_token          # For Studio write operations
SANITY_DRAFT_TOKEN=your_read_token         # For draft preview (optional for production)

# Draft Preview (optional - for previewing draft posts)
SANITY_DRAFT_SECRET_TOKEN=your_secret_token_for_preview

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_string

# Google OAuth (for authentication)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Provider (for credentials auth)
EMAIL_SERVER=smtp://user:pass@smtp.example.com:587
EMAIL_FROM=noreply@example.com
```

### Getting Sanity Tokens

1. Go to [sanity.io/manage](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** → **Tokens**
4. Create tokens:
   - **Write token**: Editor role (for Studio)
   - **Read token**: Viewer role (for draft preview)

### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google` (development)
   - `https://yourdomain.com/api/auth/callback/google` (production)

## 📝 Content Management

### Accessing Sanity Studio

1. **Navigate to Studio**
   - Local: `http://localhost:3000/studio`
   - Production: `https://yourdomain.com/studio`

2. **Sign in** with your Sanity credentials

3. **Content Types Available**:
   - **Posts**: Blog articles
   - **Authors**: Author profiles
   - **Tags**: Content categories
   - **Site Settings**: Global site configuration

## ✍️ Adding Blog Posts

### Method 1: Using Sanity Studio (Recommended)

1. **Go to Sanity Studio** (`/studio`)

2. **Click "Post" → "Create new"**

3. **Fill in the required fields**:
   - **Title**: Your post title
   - **Slug**: Auto-generated (or customize)
   - **Excerpt**: Brief summary for listings
   - **Author**: Select from authors
   - **Tags**: Choose relevant tags
   - **Cover Image**: Upload featured image
   - **Body**: Write your content using rich text editor
   - **Status**: Choose "draft" or "published"
   - **Published Date**: Set publication date
   - **Members Only**: Toggle for restricted content

4. **Additional Options**:
   - **SEO Title**: Custom meta title
   - **SEO Description**: Meta description
   - **Canonical URL**: If republishing content
   - **Featured**: Mark as featured post

5. **Save and Publish**
   - Click "Publish" to make live
   - Or save as draft for later

### Method 2: Using Draft Preview

1. **Create a draft post** in Sanity Studio (set status to "draft")

2. **Preview the draft**:

   ```
   http://localhost:3000/api/draft/enable?secret=YOUR_SECRET&slug=/blog/your-post-slug
   ```

3. **View your draft** at `http://localhost:3000/blog/your-post-slug`

4. **Exit draft mode**:
   ```
   http://localhost:3000/api/draft/disable
   ```

### Content Tips

- **Images**: Use Sanity's image CDN for optimized delivery
- **Rich Text**: Supports headings, lists, links, code blocks, and images
- **SEO**: Always fill in SEO fields for better search rankings
- **Tags**: Use consistent tag naming for better organization
- **Excerpts**: Keep under 160 characters for optimal display

## 🎨 Creating New Pages

### Static Pages

1. **Create a new file** in `app/your-page/page.tsx`:

```typescript
import {Metadata} from 'next'
import PageContainer from '@/components/PageContainer'
import PageTitle from '@/components/PageTitle'

export const metadata: Metadata = {
  title: 'Your Page Title',
  description: 'Your page description',
}

export default function YourPage() {
  return (
    <PageContainer>
      <PageTitle>Your Page Title</PageTitle>
      <div className="prose dark:prose-invert max-w-none">
        <p>Your content here...</p>
      </div>
    </PageContainer>
  )
}
```

2. **Add to navigation** in `data/headerNavLinks.ts`:

```typescript
const headerNavLinks = [
  { href: '/', title: 'Home' },
  { href: '/blog', title: 'Blog' },
  { href: '/your-page', title: 'Your Page' }, // Add this
  { href: '/about', title: 'About' },
]
```

### Dynamic Pages with Sanity

1. **Create a schema** in `sanity/schemaTypes/yourType.ts`

2. **Add to schema index** in `sanity/schemaTypes/index.ts`

3. **Create queries** in `lib/sanity/queries.ts`

4. **Create the page** in `app/your-page/[slug]/page.tsx`:

```typescript
import {notFound} from 'next/navigation'
import {client} from '@/lib/sanity/client'

export async function generateStaticParams() {
  const items = await client.fetch('*[_type == "yourType"]{ slug }')
  return items.map((item) => ({ slug: item.slug.current }))
}

export default async function YourPage({params}: {params: {slug: string}}) {
  const item = await client.fetch(
    '*[_type == "yourType" && slug.current == $slug][0]',
    {slug: params.slug}
  )

  if (!item) notFound()

  return <div>{/* Render your content */}</div>
}
```

## 🎨 Customization

### Site Metadata

Edit `data/siteMetadata.js`:

```javascript
const siteMetadata = {
  title: 'Your Blog Title',
  author: 'Your Name',
  headerTitle: 'Your Header',
  description: 'Your blog description',
  language: 'en-us',
  theme: 'system',
  siteUrl: 'https://yourdomain.com',
  siteRepo: 'https://github.com/yourusername/yourrepo',
  siteLogo: '/static/images/logo.png',
  socialBanner: '/static/images/twitter-card.png',
  email: 'your@email.com',
  github: 'https://github.com/yourusername',
  twitter: 'https://twitter.com/yourusername',
  linkedin: 'https://www.linkedin.com/in/yourusername',
}
```

### Styling

- **Colors**: Edit Tailwind config in `tailwind.config.js`
- **Fonts**: Update in `app/layout.tsx`
- **Components**: Modify components in `components/` directory
- **CSS**: Global styles in `css/tailwind.css`

### Sanity Studio

Customize the Studio in `sanity.config.ts`:

```typescript
export default defineConfig({
  // Your customizations
  title: 'Your Blog Studio',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
})
```

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository
   - Add environment variables
   - Deploy!

3. **Configure Environment Variables** in Vercel:
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env.local`
   - Redeploy if needed

4. **Update OAuth Redirects**
   - Add production URL to Google OAuth allowed redirects
   - Update `NEXTAUTH_URL` in environment variables

### Deploy Sanity Studio

The Studio is automatically deployed with your Next.js app at `/studio`. No separate deployment needed!

### Post-Deployment

1. **Test all features**:
   - Authentication
   - Studio access
   - Draft preview
   - Blog posts display

2. **Configure CORS** in Sanity:
   - Go to sanity.io/manage
   - Add your domain to allowed origins

3. **Set up webhooks** (optional):
   - Configure revalidation webhooks in Sanity
   - Trigger rebuilds on content changes

## 📁 Project Structure

```
├── app/                      # Next.js app directory
│   ├── blog/                # Blog pages
│   ├── studio/              # Sanity Studio
│   ├── api/                 # API routes
│   │   ├── auth/           # NextAuth.js
│   │   └── draft/          # Draft preview
│   ├── login/              # Login page
│   └── account/            # User account
├── components/              # React components
├── lib/                    # Utilities
│   ├── sanity/            # Sanity queries & helpers
│   └── auth.ts            # NextAuth config
├── sanity/                 # Sanity Studio config
│   └── schemaTypes/       # Content schemas
├── data/                   # Static data
├── public/                 # Static assets
└── styles/                 # Global styles
```

## 🔧 Common Tasks

### Adding a New Tag

1. Go to Studio → Tags
2. Click "Create new"
3. Enter title (slug auto-generates)
4. Publish

### Updating Site Settings

1. Go to Studio → Site Settings
2. Update fields:
   - Site title
   - Site description
   - SEO defaults
   - OG image
3. Publish changes

### Restricting Content

1. Edit post in Studio
2. Toggle "Members Only" to ON
3. Publish
4. Users must sign in to view

### Managing Authors

1. Go to Studio → Authors
2. Add/edit author profiles
3. Assign to posts

## 📚 Additional Documentation

For more detailed guides, check these files:

- `SANITY_QUICKSTART.md` - Quick setup guide
- `SANITY_SETUP.md` - Detailed Sanity configuration
- `DRAFT_PREVIEW_SETUP.md` - Draft preview system
- `SANITY_STUDIO_GUIDE.md` - Studio customization
- `SANITY_SCHEMAS.md` - Content schema details

## 🐛 Troubleshooting

### Build Errors

**Error**: `Missing SANITY_DRAFT_TOKEN`

- **Solution**: Make `SANITY_DRAFT_TOKEN` optional or add it to `.env.local`

**Error**: TypeScript errors in Sanity schemas

- **Solution**: Check schema types match the TypeScript interfaces

### Studio Issues

**Problem**: Can't access Studio

- **Solution**: Check `SANITY_API_TOKEN` is set correctly

**Problem**: Changes not appearing

- **Solution**: Check CORS settings in Sanity dashboard

### Authentication Issues

**Problem**: Google OAuth not working

- **Solution**: Verify redirect URIs in Google Console match exactly

**Problem**: Session not persisting

- **Solution**: Check `NEXTAUTH_SECRET` is set and consistent

## 📄 License

MIT License - feel free to use this project for your own blog!

## 🙏 Acknowledgments

Built with:

- [Next.js](https://nextjs.org/)
- [Sanity](https://www.sanity.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [NextAuth.js](https://next-auth.js.org/)
- Based on [Tailwind Next.js Starter Blog](https://github.com/timlrx/tailwind-nextjs-starter-blog)

---

**Questions or issues?** Open an issue on [GitHub](https://github.com/NikhilNandyala/azure-daily-blog/issues)

- [blog.r00ks.io](https://blog.r00ks.io/) - Austin Rooks's personal blog ([source code](https://github.com/Austionian/blog.r00ks)).
- [honghong.me](https://honghong.me) - Tszhong's personal website ([source code](https://github.com/tszhong0411/home))
- [marceloformentao.dev](https://marceloformentao.dev) - Marcelo Formentão personal website ([source code](https://github.com/marceloavf/marceloformentao.dev)).
- [abiraja.com](https://www.abiraja.com/) - with a [runnable JS code snippet component!](https://www.abiraja.com/blog/querying-solana-blockchain)
- [bpiggin.com](https://www.bpiggin.com) - Ben Piggin's personal blog
- [maqib.cn](https://maqib.cn) - A blog of Chinese front-end developers 狂奔小马的博客 ([源码](https://github.com/maqi1520/nextjs-tailwind-blog))
- [ambilena.com](https://ambilena.com/) - Electronic Music Blog & imprint for upcoming musicians.
- [techipedia](https://techipedia.vercel.app) - Simple blogging progressive web app with custom installation button and top progress bar
- [reubence.com](https://reubence.com) - Reuben Rapose's Digital Garden
- [axolo.co/blog](https://axolo.co/blog) - Engineering management news & axolo.co updates (with image preview for article in the home page)
- [musing.vercel.app](https://musing.vercel.app/) - Parth Desai's personal blog ([source code](https://github.com/pycoder2000/blog))
- [onyourmental.com](https://www.onyourmental.com/) - [Curtis Warcup's](https://github.com/Cwarcup) website for the On Your Mental Podcast ([source code](https://github.com/Cwarcup/on-your-mental))
- [cwarcup.com](https://www.cwarcup.com/) - Curtis Warcup's personal website and blog ([source code](https://github.com/Cwarcup/personal-blog)).
