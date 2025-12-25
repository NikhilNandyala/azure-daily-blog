import { defineType, defineField } from 'sanity'
import { BlockElementIcon } from '@sanity/icons'
import { codeInput } from '@sanity/code-input'

export const postType = defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required().min(3).max(200),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value || !value.current) return 'Slug is required'
          if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)) {
            return 'Slug must be lowercase with hyphens only'
          }
          return true
        }),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule.required().min(10).max(300).warning('Excerpt should be 10-300 characters for SEO'),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H1', value: 'h1' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Numbered', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: (rule) =>
                      rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }),
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              description: 'Important for SEO and accessibility',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
        {
          type: 'code',
          name: 'code',
          title: 'Code Block',
          options: {
            language: 'javascript',
            languageAlternatives: [
              { title: 'JavaScript', value: 'javascript' },
              { title: 'TypeScript', value: 'typescript' },
              { title: 'JSX', value: 'jsx' },
              { title: 'TSX', value: 'tsx' },
              { title: 'Python', value: 'python' },
              { title: 'Bash', value: 'bash' },
              { title: 'Shell', value: 'shell' },
              { title: 'PowerShell', value: 'powershell' },
              { title: 'JSON', value: 'json' },
              { title: 'YAML', value: 'yaml' },
              { title: 'Markdown', value: 'markdown' },
              { title: 'HTML', value: 'html' },
              { title: 'CSS', value: 'css' },
              { title: 'SCSS', value: 'scss' },
              { title: 'SQL', value: 'sql' },
              { title: 'GraphQL', value: 'graphql' },
              { title: 'Go', value: 'go' },
              { title: 'Rust', value: 'rust' },
              { title: 'C#', value: 'csharp' },
              { title: 'Java', value: 'java' },
              { title: 'PHP', value: 'php' },
              { title: 'Ruby', value: 'ruby' },
              { title: 'Swift', value: 'swift' },
              { title: 'Kotlin', value: 'kotlin' },
              { title: 'Dart', value: 'dart' },
              { title: 'Dockerfile', value: 'dockerfile' },
              { title: 'NGINX', value: 'nginx' },
              { title: 'Terraform', value: 'terraform' },
            ],
            withFilename: true,
          },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'markdownBody',
      title: 'Markdown Body',
      type: 'text',
      description:
        'Optional: Use Markdown instead of rich text. Supports GitHub Flavored Markdown, code blocks, Mermaid diagrams, and more.',
      rows: 20,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Optional: Cover image for the post',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: { type: 'tag' },
        },
      ],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: { type: 'author' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      validation: (rule) =>
        rule.custom((value, context) => {
          if (context.document?.status === 'published' && !value) {
            return 'Published date is required when status is published'
          }
          return true
        }),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
        ],
      },
      initialValue: 'draft',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Display this post in featured section',
      initialValue: false,
    }),
    defineField({
      name: 'membersOnly',
      title: 'Members Only',
      type: 'boolean',
      description: 'Restrict this post to authenticated members',
      initialValue: false,
    }),
    defineField({
      name: 'views',
      title: 'Views',
      type: 'number',
      description: 'Number of times this post has been viewed',
      initialValue: 0,
      readOnly: true,
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      validation: (rule) => rule.max(60).warning('SEO titles should be under 60 characters'),
      description: 'Leave blank to use post title',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      validation: (rule) =>
        rule.max(160).warning('SEO descriptions should be under 160 characters'),
      description: 'Leave blank to use excerpt',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      description: 'For posts republished or migrated from other sites',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      author: 'author.name',
      media: 'coverImage',
      status: 'status',
      featured: 'featured',
    },
    prepare(selection) {
      const { title, author, media, status, featured } = selection
      return {
        title,
        subtitle: `${status === 'published' ? '✓' : '○'} ${author || 'No author'} ${
          featured ? '⭐' : ''
        }`,
        media,
      }
    },
  },
  orderings: [
    {
      title: 'Published Date (Newest)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
    {
      title: 'Published Date (Oldest)',
      name: 'publishedAtAsc',
      by: [{ field: 'publishedAt', direction: 'asc' }],
    },
    {
      title: 'Title (A-Z)',
      name: 'titleAsc',
      by: [{ field: 'title', direction: 'asc' }],
    },
  ],
})
