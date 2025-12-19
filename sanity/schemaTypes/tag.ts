import { defineType, defineField } from 'sanity'
import { TagIcon } from '@sanity/icons'

export const tagType = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) =>
        rule.required().min(2).max(50).error('Tag title is required (2-50 characters)'),
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
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare(selection) {
      const { title } = selection
      return {
        title: title ? `#${title}` : 'Untitled tag',
      }
    },
  },
})
