import { defineType, defineField } from 'sanity'
import { UserIcon } from '@sanity/icons'

export const authorType = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required().min(2).max(100).error('Author name is required'),
    }),
    defineField({
      name: 'image',
      title: 'Profile Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Bio',
      type: 'text',
      rows: 4,
      validation: (rule) =>
        rule.required().min(10).max(500).warning('Bio should be 10-500 characters'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
    },
    prepare(selection) {
      const { title, media } = selection
      return {
        title,
        media,
      }
    },
  },
})
