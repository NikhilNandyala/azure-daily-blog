# Sanity Schemas Architecture Diagram

## Database Schema Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                         SANITY DATABASE                         │
└─────────────────────────────────────────────────────────────────┘

┌──────────────┐         ┌──────────────┐         ┌──────────────┐
│              │         │              │         │              │
│   AUTHOR     │         │     TAG      │         │     POST     │
│ (3 fields)   │         │ (2 fields)   │         │(13 fields)   │
│              │         │              │         │              │
└──────────────┘         └──────────────┘         └──────────────┘
       △                        △                        △
       │                        │                        │
       │                        │                        │
       └────────────────┬───────┘                        │
                        │                                │
                  References                            │
                        │                                │
        ┌───────────────┴────────────────────────────────┘
        │
        └──→ Contains Post Documents
               - title, slug, excerpt, body
               - coverImage, publishedAt, status
               - featured, membersOnly, seoTitle, etc.

                    Each Post References:
                    - 1 Author (required)
                    - Multiple Tags (min 1)

┌──────────────────────────────────────┐
│      SITE SETTINGS                   │
│      (1 document / singleton)         │
│                                      │
│  - siteTitle                         │
│  - siteDescription                   │
│  - defaultSeoTitle                   │
│  - defaultSeoDescription             │
│  - ogImage                           │
└──────────────────────────────────────┘
         (Global defaults for all posts)
```

---

## Detailed Schema Breakdown

### POST Schema (13 Fields)

```
POST
├── Content Fields
│   ├── title (string, required, 3-200 chars)
│   ├── slug (slug, required, auto-generated)
│   ├── excerpt (text, required, 10-300 chars)
│   ├── body (rich text array, required, min 1 block)
│   │   ├── Blocks (paragraphs, headings H1-H4, quotes)
│   │   ├── Lists (bullets, numbered)
│   │   ├── Marks (bold, italic, code, underline, strike)
│   │   ├── Annotations (links with URL validation)
│   │   └── Images (embedded with hotspot)
│   └── coverImage (image, required, hotspot)
│
├── Metadata Fields
│   ├── tags (array of references → TAG, required, min 1)
│   ├── author (reference → AUTHOR, required)
│   ├── publishedAt (datetime, required if published)
│   └── status (enum: draft/published, default: draft)
│
├── Feature Flags
│   ├── featured (boolean, default: false)
│   └── membersOnly (boolean, default: false)
│
└── SEO Fields
    ├── seoTitle (string, ≤60 chars, optional)
    ├── seoDescription (string, ≤160 chars, optional)
    └── canonicalUrl (url, optional)

Studio Preview: "✓ Author Name ⭐ | Title"
Orderings: By Date (new/old), By Title (A-Z)
```

### TAG Schema (2 Fields)

```
TAG
├── title (string, required, 2-50 chars)
└── slug (slug, required, auto-generated)

Studio Preview: "#TagName"
Orderings: By Title (A-Z)
Usage: Referenced by multiple Posts (many-to-many)
```

### AUTHOR Schema (3 Fields)

```
AUTHOR
├── name (string, required, 2-100 chars)
├── image (image, required, hotspot)
└── bio (text, required, 10-500 chars)

Studio Preview: "Name | Profile Image"
Orderings: By Name (A-Z)
Usage: Referenced by Posts (one-to-many)
```

### SITE SETTINGS Schema (5 Fields, Singleton)

```
SITE SETTINGS (Single Document)
├── siteTitle (string, required, 3-100 chars)
├── siteDescription (string, required, 20-300 chars)
├── defaultSeoTitle (string, required, ≤60 chars)
├── defaultSeoDescription (string, required, ≤160 chars)
└── ogImage (image, required, 1200x630px recommended)

Studio Preview: "Site Settings | Configuration"
Usage: Fallback values for all posts
```

---

## Content Workflow

```
                    SANITY STUDIO
                    /studio route
                         │
                    ┌────┴────┐
                    │          │
              Create Doc   Edit Doc
                    │          │
            ┌───────┴──────────┴────────┐
            │                           │
        Create Authors             Create Tags
            │                           │
            └───────────┬───────────────┘
                        │
                  Create Posts
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    Select Author   Add Tags        Write Body
        │               │               │
        └───────────────┼───────────────┘
                        │
                  Upload Image
                        │
        ┌───────────────┼───────────────┐
        │               │               │
    Set Featured   Set Members Only  Set Status
        │               │               │
        └───────────────┼───────────────┘
                        │
                    Publish
                        │
                 (saved in DB)
                        │
    ┌───────────────────┼───────────────────┐
    │                   │                   │
Fetch via Client   Query by Tag      Query by Author
    │                   │                   │
    └───────────────────┼───────────────────┘
                        │
                    Frontend
                   (Next.js App)
```

---

## Query Execution Flow

```
Frontend (Next.js)
     │
     ├─→ import {getPublishedPosts} from '@/sanity/client'
     │
     └─→ const posts = await getPublishedPosts()
              │
              └─→ sanity/client.ts
                     │
                     └─→ GROQ Query
                        *[_type == "post" && status == "published"]
                        | order(publishedAt desc)
                        {
                          _id, title, slug, excerpt, coverImage,
                          tags[]->{ title, slug },
                          author->{ name, bio, image },
                          publishedAt
                        }
                     │
                     └─→ Sanity API
                        (NEXT_PUBLIC_SANITY_PROJECT_ID)
                        (NEXT_PUBLIC_SANITY_DATASET)
                     │
                     └─→ Database Query
                     │
                     └─→ Return JSON Result
                        [
                          {
                            _id: "...",
                            title: "Azure Networking",
                            slug: {current: "azure-networking"},
                            excerpt: "...",
                            coverImage: {...},
                            tags: [
                              {_ref: "...", title: "Azure"},
                              {_ref: "...", title: "Networking"}
                            ],
                            author: {
                              _ref: "...",
                              name: "Nikhil",
                              bio: "...",
                              image: {...}
                            },
                            publishedAt: "2025-12-14T..."
                          },
                          ...
                        ]
                     │
                     └─→ Render in Component
                        Blog Post Listing
                        Author Info
                        Tags
                        etc.
```

---

## Validation Flow

```
User Input (Studio UI)
     │
     └─→ Field Validation (Real-time)
           │
           ├─→ Title: Check 3-200 chars
           ├─→ Slug: Check lowercase-hyphens pattern
           ├─→ Excerpt: Check 10-300 chars
           ├─→ Body: Check minimum 1 block
           ├─→ Status: Must be draft or published
           ├─→ PublishedAt: Required if published
           └─→ Tags: Require minimum 1
           │
     └─→ Show Error Message (if invalid)
              │
              └─→ User Fixes Input
                     │
                     └─→ Validation Passes
                          │
                          └─→ Publish Document
```

---

## Data Types Reference

### Rich Text (body field)

```typescript
;[
  // Text Block
  {
    _type: 'block',
    style: 'normal' | 'h1' | 'h2' | 'h3' | 'h4' | 'blockquote',
    children: [
      {
        _type: 'span',
        text: 'Hello world',
        marks: ['bold', 'em', 'code', 'underline', 'strike-through'],
      },
    ],
  },

  // Image Block
  {
    _type: 'image',
    asset: { _ref: 'image-...' },
    hotspot: { x, y, height, width },
  },

  // Link Annotation (within span)
  {
    _type: 'link',
    href: 'https://example.com',
  },
]
```

### Slug Type

```typescript
slug: {
  _type: "slug",
  current: "lowercase-with-hyphens"
}
```

### Reference Type

```typescript
author: {
  _ref: "author-document-id",
  _type: "reference"
}

tags: [
  {_ref: "tag-document-id-1", _type: "reference"},
  {_ref: "tag-document-id-2", _type: "reference"}
]
```

### Image Type

```typescript
coverImage: {
  _type: "image",
  asset: {
    _ref: "image-...",
    _type: "reference"
  },
  hotspot: {
    x: 0.5,
    y: 0.5,
    height: 0.8,
    width: 0.8,
    _type: "sanity.imageCrop"
  }
}
```

---

## Environment Configuration

```
.env.local
├── NEXT_PUBLIC_SANITY_PROJECT_ID
│   └─ Your 32-character Sanity project ID
│
├── NEXT_PUBLIC_SANITY_DATASET
│   └─ "production" (or your dataset name)
│
└── SANITY_API_TOKEN (optional)
    └─ For API write operations
```

---

## Studio Routes & Features

```
/studio
├── Post
│   ├── Create ──→ Fill 13 fields
│   ├── List ────→ View all posts with preview
│   ├── Edit ────→ Modify fields
│   ├── Publish ─→ Save to database
│   └── Delete ──→ Remove document
│
├── Tag
│   ├── Create ──→ Fill 2 fields
│   ├── List ────→ View all tags (#hashtag style)
│   ├── Edit ────→ Modify fields
│   ├── Publish ─→ Save to database
│   └── Delete ──→ Remove document
│
├── Author
│   ├── Create ──→ Fill 3 fields
│   ├── List ────→ View all authors with photos
│   ├── Edit ────→ Modify fields
│   ├── Publish ─→ Save to database
│   └── Delete ──→ Remove document
│
└── Site Settings
    ├── Create ──→ Fill 5 fields (singleton)
    ├── Edit ────→ Modify global config
    ├── Publish ─→ Save to database
    └── Note: Only 1 document should exist
```

---

## Key Integration Points

```
sanity/
├── schemaTypes/
│   ├── post.ts          ←→ Studio Post editor
│   ├── tag.ts           ←→ Studio Tag editor
│   ├── author.ts        ←→ Studio Author editor
│   ├── siteSettings.ts  ←→ Studio Settings editor
│   └── index.ts         ←→ Exports to sanity.config.ts
│
├── client.ts            ←→ Query functions
│   ├── getPosts()       ←→ Fetch from /blog pages
│   ├── getPost()        ←→ Fetch from /blog/[slug] pages
│   ├── getTags()        ←→ Fetch from /tags pages
│   ├── getAuthors()     ←→ Fetch author data
│   └── getSiteSettings()←→ Fetch global config
│
└── config.ts            ←→ Sanity initialization
    ├── Project ID       ←→ .env.local
    ├── Dataset          ←→ .env.local
    └── Plugins          ←→ Studio features

app/studio/
├── page.tsx             ←→ /studio route entry
├── layout.tsx           ←→ /studio layout
└── studio-wrapper.tsx   ←→ Sanity Studio component
```

---

This architecture provides a flexible, scalable, and user-friendly CMS for managing blog content with full editorial control through the Sanity Studio interface.
