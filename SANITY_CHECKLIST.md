# 🎯 Sanity Studio Setup Checklist

## Pre-Launch Checklist

### ✅ System Setup (Completed)

- [x] Sanity packages installed (`sanity`, `@sanity/cli`, `@sanity/vision`)
- [x] Sanity configuration created (`sanity.config.ts`)
- [x] Schema types defined (`sanity/schemaTypes/blog.ts`)
- [x] Sanity client configured (`sanity/client.ts`)
- [x] Studio route created (`app/studio/`)
- [x] Documentation created (3 comprehensive guides)
- [x] Environment template created (`.env.sanity.example`)
- [x] npm scripts added for Sanity commands
- [x] Build passes successfully ✅

### 📋 Manual Setup Steps (You Need to Do)

- [ ] Create Sanity project at https://www.sanity.io/manage
- [ ] Get Project ID and Dataset name from Sanity
- [ ] Create `.env.local` file in project root
- [ ] Add `NEXT_PUBLIC_SANITY_PROJECT_ID` to `.env.local`
- [ ] Add `NEXT_PUBLIC_SANITY_DATASET` to `.env.local`
- [ ] (Optional) Create API token for server-side queries
- [ ] (Optional) Add `SANITY_API_TOKEN` to `.env.local`

### 🚀 Launch Checklist

- [ ] Run `npm run dev`
- [ ] Navigate to http://localhost:3000/studio
- [ ] Sign in with your Sanity account
- [ ] Create first blog post in Studio
- [ ] Verify post appears in GROQ query (Vision tool)
- [ ] Update blog pages to fetch from Sanity
- [ ] Test end-to-end: create post → fetch → display

### 🌐 Deployment Checklist

- [ ] Push code to GitHub
- [ ] Create Vercel project (or your hosting platform)
- [ ] Add environment variables to deployment platform
- [ ] Deploy Next.js app
- [ ] Verify Studio accessible at `/studio` on production domain
- [ ] (Optional) Deploy Studio to Sanity hosting with `npm run sanity:deploy`
- [ ] Create content backup plan

## Quick Start Commands

```bash
# 1. Start development
npm run dev

# 2. Access Studio (after creating Sanity project)
# http://localhost:3000/studio

# 3. Build for production
npm run build

# 4. Deploy Studio to Sanity (optional)
npm run sanity:deploy
```

## File Reference

### Configuration Files

```
sanity.config.ts                      # Main Sanity config
.env.local                            # Your environment variables (create this)
.env.sanity.example                   # Template to copy from
```

### Source Code

```
sanity/
├── client.ts                         # Sanity client + fetch helpers
├── schemaTypes/
│   ├── index.ts                      # Export schemas
│   └── blog.ts                       # Blog post schema
└── plugins/                          # Custom plugins (optional)

app/studio/
├── page.tsx                          # Studio entry route
├── layout.tsx                        # Studio layout
└── studio-wrapper.tsx                # Studio component wrapper
```

### Documentation

```
SANITY_SETUP_SUMMARY.md               # This file
SANITY_QUICKSTART.md                  # Quick 5-step guide
SANITY_SETUP.md                       # Detailed guide
SANITY_INTEGRATION.md                 # Architecture & examples
sanity/README.md                      # Studio features
```

## Environment Variables

### Required

```
NEXT_PUBLIC_SANITY_PROJECT_ID=        # Your Sanity project ID
NEXT_PUBLIC_SANITY_DATASET=production # Your dataset name
```

### Optional (for server-side queries)

```
SANITY_API_TOKEN=                     # API token with Editor role
```

## Common Tasks

### How to Create Your First Post

1. Go to http://localhost:3000/studio
2. Click "+ Create"
3. Select "Blog Post"
4. Fill in all fields
5. Click "Publish"

### How to Query Posts in Code

```typescript
import { client } from '@/sanity/client'

// Server component
const posts = await client.fetch(`*[_type == "blog"]`)

// Client component
useEffect(() => {
  client.fetch(`*[_type == "blog"]`).then(setPosts)
}, [])
```

### How to Deploy to Production

1. Push to GitHub
2. Connect to Vercel / Netlify / etc
3. Add environment variables to platform
4. Deploy!
5. Studio works at `yourdomain.com/studio`

## Troubleshooting Quick Links

### Can't Find Project ID

→ Go to https://www.sanity.io/manage and create a project

### Studio Won't Load

→ Check `.env.local` has correct `NEXT_PUBLIC_SANITY_PROJECT_ID`
→ Restart dev server: `Ctrl+C` then `npm run dev`

### Build Fails

→ Run `npm install` to ensure all packages installed
→ Check that no syntax errors in `.env.local`

### Can't Sign In

→ Use correct Sanity account credentials
→ Check that project exists at sanity.io/manage

## Support Resources

| Resource             | Link                                    |
| -------------------- | --------------------------------------- |
| Sanity Documentation | https://www.sanity.io/docs              |
| GROQ Query Language  | https://www.sanity.io/docs/groq         |
| Schema Types         | https://www.sanity.io/docs/schema-types |
| Community Slack      | https://slack.sanity.io                 |
| API Reference        | https://www.sanity.io/docs/http-api     |

## Summary

✅ **All system setup complete and verified**

- Build passes successfully
- All files created
- Dependencies installed
- Configuration templates ready
- Comprehensive documentation provided

📝 **Next action**: Create a Sanity project at https://www.sanity.io/manage

🚀 **Then**: Add environment variables and run `npm run dev`

Good luck! 🎉
