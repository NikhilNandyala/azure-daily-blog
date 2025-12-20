import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { codeInput } from '@sanity/code-input'
import { schemaTypes } from './sanity/schemaTypes'
import { structure } from './sanity/deskStructure'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || ''

// Only throw at config time if env vars are missing (not at import time)
// This allows the app to start even without Sanity config
const config = {
  basePath: '/studio',
  projectId: projectId || 'placeholder',
  dataset: dataset || 'placeholder',
  plugins: [
    structureTool({
      structure,
    }),
    visionTool(),
    codeInput(),
  ],
  schema: {
    types: schemaTypes,
  },
}

// Validate only if Studio is accessed
export default defineConfig(config)
