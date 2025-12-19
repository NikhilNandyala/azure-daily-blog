import { defineType, defineField } from 'sanity'
import { CogIcon } from '@sanity/icons'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'siteTitle',
      title: 'Site Title',
      type: 'string',
      validation: (rule) => rule.required().min(3).max(100).error('Site title is required'),
    }),
    defineField({
      name: 'siteDescription',
      title: 'Site Description',
      type: 'text',
      rows: 3,
      validation: (rule) =>
        rule
          .required()
          .min(20)
          .max(300)
          .warning('Site description should be 20-300 characters for SEO'),
    }),
    defineField({
      name: 'defaultSeoTitle',
      title: 'Default SEO Title',
      type: 'string',
      validation: (rule) =>
        rule.required().max(60).warning('SEO titles should be under 60 characters'),
      description: 'Used when post does not have custom SEO title',
    }),
    defineField({
      name: 'defaultSeoDescription',
      title: 'Default SEO Description',
      type: 'text',
      rows: 2,
      validation: (rule) =>
        rule.required().max(160).warning('SEO descriptions should be under 160 characters'),
      description: 'Used when post does not have custom SEO description',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
      description: 'Default social media sharing image (1200x630px recommended)',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Site Settings',
        subtitle: 'Global SEO and metadata configuration',
      }
    },
  },
})
