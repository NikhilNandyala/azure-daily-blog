import { defineType, defineField } from 'sanity'

export const blogType = defineType({
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Publish Date',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'string',
    }),
    defineField({
      name: 'summary',
      title: 'Summary',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [
        {
          type: 'string',
        },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'text',
      rows: 15,
    }),
    defineField({
      name: 'membersOnly',
      title: 'Members Only',
      type: 'boolean',
      description: 'If enabled, this post will be restricted to authenticated members',
      initialValue: false,
    }),
    defineField({
      name: 'featured',
      title: 'Featured',
      type: 'boolean',
      description: 'Display this post on featured section',
      initialValue: false,
    }),
    defineField({
      name: 'pinned',
      title: 'Pinned',
      type: 'boolean',
      description: 'Pin this post to top of listings',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      date: 'date',
    },
    prepare(selection) {
      const { title, date } = selection
      return {
        title,
        subtitle: date ? new Date(date).toLocaleDateString() : 'No date',
      }
    },
  },
})
