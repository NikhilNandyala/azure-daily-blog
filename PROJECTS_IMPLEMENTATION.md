# Projects Feature Implementation Guide

## Overview

Complete Sanity CMS-based Projects system for your Next.js blog. After setup, you can add/edit projects from Sanity Studio without code changes.

## Features Implemented

### 1. Sanity Schema (15 Fields)

**File:** `sanity/schemaTypes/project.ts`

Fields:

- **title** (required) - Project name
- **slug** (auto-generated) - URL-friendly identifier
- **shortDescription** (20-160 chars) - Brief summary for cards
- **body** (Portable Text) - Full project description with rich text
- **heroImage** (optional) - Main project image
- **gallery** (array) - Additional screenshots/images
- **techStack** (array) - Technologies used (e.g., "React", "TypeScript")
- **category** (enum) - web-app, mobile-app, cli-tool, library, infrastructure, api, devops, data-science, ml, other
- **status** (required) - active, paused, or archived
- **repoUrl** (optional) - GitHub/GitLab repository link
- **liveUrl** (optional) - Live demo/production URL
- **docsUrl** (optional) - Documentation site
- **featured** (boolean) - Show in "Featured Projects" section
- **publishedAt** (datetime) - Publication date

### 2. Sanity Studio Integration

**File:** `sanity/deskStructure.ts`

Studio sections added:

- All Projects
- Featured Projects
- Active Projects
- Paused Projects
- Archived Projects

### 3. TypeScript Types

**File:** `lib/sanity/types.ts`

Interfaces:

- `Project` - Full project type with all fields
- `ProjectListItem` - Optimized for listing pages (omits body & gallery)

### 4. GROQ Queries (7 Functions)

**File:** `lib/sanity/projectQueries.ts`

- `getAllProjects(limit?, offset?)` - All projects, paginated
- `getFeaturedProjects(limit?)` - Featured projects only
- `getProjectBySlug(slug)` - Single project with full details
- `getAllProjectSlugs()` - For generateStaticParams
- `getProjectsByStatus(status, limit?)` - Filter by status
- `getProjectsByCategory(category, limit?)` - Filter by category
- `getProjectCategories()` - List of unique categories

### 5. Reusable Components

#### StatusBadge

**File:** `components/StatusBadge.tsx`

- Visual status indicators with icons
- Colors: Active (green), Paused (yellow), Archived (gray)
- Sizes: sm, md

#### TechChip

**File:** `components/TechChip.tsx`

- Technology tag chips with blue theme
- Sizes: sm, md

#### ProjectCard

**File:** `components/ProjectCard.tsx`

- Complete project card for listing pages
- Features:
  - Optional hero image with hover effects
  - Status badge + category label
  - Short description
  - Tech stack chips (first 5 + "X more" indicator)
  - External links (Live Demo, Source Code)
  - Clean collapse when fields missing

#### ProjectsClient

**File:** `components/ProjectsClient.tsx`

- Client-side filtering component
- Filters:
  - Status (All, Active, Paused, Archived)
  - Category (All categories from data)
  - Search (by title or tech stack)
- Active filter display with clear buttons
- Results count
- Responsive grid layout

### 6. Pages

#### Projects Listing

**File:** `app/projects/page.tsx`

- Server-side data fetching
- Featured Projects section (conditional)
- Client-side filters
- ISR revalidation (1 hour)
- Responsive grid (1/2/3 columns)
- "Back to Home" navigation

#### Project Detail

**File:** `app/projects/[slug]/page.tsx`

- Dynamic route with ISR
- generateStaticParams for all projects
- SEO metadata with OG images
- Sections:
  - Hero image (if present)
  - Title + Status + Category
  - External links (Live/Repo/Docs)
  - Tech stack chips
  - Full project body (Portable Text)
  - Gallery (if images exist)
- "Back to Projects" navigation

### 7. Image Handling

**File:** `lib/sanity/imageUrl.ts`

- Added `urlForImage()` function
- Flexible builder for custom transformations
- Supports chaining: `.width(1200).height(630).url()`

## ISR Configuration

Both pages use Incremental Static Regeneration:

```typescript
export const revalidate = 3600 // 1 hour
```

## How to Use

### 1. Start Sanity Studio

```powershell
npm run dev
```

Visit `http://localhost:3000/studio`

### 2. Add Your First Project

1. Click "Projects" in Studio
2. Create new project
3. Fill in required fields:
   - Title
   - Slug (auto-generates)
   - Short Description (20-160 chars)
   - Status (active/paused/archived)
   - Category

4. Optional fields:
   - Hero Image (upload)
   - Body (rich text editor)
   - Tech Stack (add technologies)
   - External URLs (repo, live, docs)
   - Gallery images
   - Featured toggle
   - Published At date

5. Publish

### 3. View Your Projects

- Listing: `http://localhost:3000/projects`
- Detail: `http://localhost:3000/projects/[your-slug]`

### 4. Use Filters

On the listing page:

- Filter by Status dropdown
- Filter by Category dropdown
- Search by title or technology
- Active filters show as removable chips

## Page Metadata

Both pages include SEO optimization:

- Dynamic titles
- Meta descriptions
- Open Graph images (from hero image)
- Twitter cards

## Design System

- Dark navy background (`bg-gray-900`)
- Azure blue accents (`text-blue-400`, `border-blue-500`)
- Hover effects with blue glow
- Clean collapse (no placeholders for missing data)
- Responsive: Mobile → Tablet → Desktop

## Category Mapping

The system converts category slugs to display names:

- `web-app` → "Web Application"
- `mobile-app` → "Mobile App"
- `cli-tool` → "CLI Tool"
- `library` → "Library/Package"
- `infrastructure` → "Infrastructure"
- `api` → "API/Backend"
- `devops` → "DevOps"
- `data-science` → "Data Science"
- `ml` → "Machine Learning"
- `other` → "Other"

## Next Steps

1. **Add your first project** in Sanity Studio
2. **Test the listing page** - verify filters work
3. **Test detail page** - click through to project details
4. **Add more projects** - system is fully functional
5. **Customize if needed**:
   - Add more categories in `project.ts` schema
   - Adjust ISR revalidation time
   - Modify card layout
   - Add more filters

## Troubleshooting

### Projects don't appear

- Check Sanity Studio - are projects published?
- Verify `publishedAt` date is set (or will use `_createdAt`)
- Check browser console for query errors

### Images not loading

- Verify images are uploaded in Studio
- Check Sanity project ID and dataset in config
- Confirm image URLs in Network tab

### TypeScript errors

- Run `npm run type-check` to verify all types
- Ensure all Sanity queries return correct types

## Files Modified/Created

**Created:**

- `sanity/schemaTypes/project.ts`
- `lib/sanity/projectQueries.ts`
- `components/StatusBadge.tsx`
- `components/TechChip.tsx`
- `components/ProjectCard.tsx`
- `components/ProjectsClient.tsx`
- `app/projects/[slug]/page.tsx`

**Modified:**

- `sanity/schemaTypes/index.ts` - Added projectType
- `sanity/deskStructure.ts` - Added Projects section
- `lib/sanity/types.ts` - Added Project interfaces
- `lib/sanity/imageUrl.ts` - Added urlForImage function
- `app/projects/page.tsx` - Replaced placeholder with real data

## Success! 🎉

Your Projects feature is fully implemented. You can now manage all your projects through Sanity Studio without touching code!
