import { ListItemBuilder, StructureResolver } from 'sanity/structure'
import { DocumentsIcon, EditIcon } from '@sanity/icons'

/**
 * Desk Structure Configuration
 * Organizes the Studio content editor with custom views for Posts, Tags, Authors, and Settings
 * Includes status-based filtering and dedicated sections for drafts and published content
 */

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      // ====================================================================
      // POSTS SECTION
      // ====================================================================
      S.listItem()
        .title('Posts')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Posts')
            .items([
              // All Posts
              S.listItem()
                .title('All Posts')
                .child(
                  S.documentList()
                    .title('All Posts')
                    .filter('_type == "post"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                )
                .icon(DocumentsIcon),

              S.divider(),

              // Drafts Only
              S.listItem()
                .title('Drafts')
                .child(
                  S.documentList()
                    .title('Draft Posts')
                    .filter('_type == "post" && status == "draft"')
                    .defaultOrdering([{ field: '_updatedAt', direction: 'desc' }])
                )
                .icon(EditIcon),

              // Published Posts
              S.listItem()
                .title('Published')
                .child(
                  S.documentList()
                    .title('Published Posts')
                    .filter('_type == "post" && status == "published"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),

              S.divider(),

              // Featured Posts
              S.listItem()
                .title('Featured')
                .child(
                  S.documentList()
                    .title('Featured Posts')
                    .filter('_type == "post" && featured == true')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),

              // Members Only Posts
              S.listItem()
                .title('Members Only')
                .child(
                  S.documentList()
                    .title('Members Only Posts')
                    .filter('_type == "post" && membersOnly == true')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
            ])
        ),

      S.divider(),

      // ====================================================================
      // PROJECTS SECTION
      // ====================================================================
      S.listItem()
        .title('Projects')
        .icon(DocumentsIcon)
        .child(
          S.list()
            .title('Projects')
            .items([
              // All Projects
              S.listItem()
                .title('All Projects')
                .child(
                  S.documentList()
                    .title('All Projects')
                    .filter('_type == "project"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                )
                .icon(DocumentsIcon),

              S.divider(),

              // Featured Projects
              S.listItem()
                .title('Featured')
                .child(
                  S.documentList()
                    .title('Featured Projects')
                    .filter('_type == "project" && featured == true')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),

              // Active Projects
              S.listItem()
                .title('Active')
                .child(
                  S.documentList()
                    .title('Active Projects')
                    .filter('_type == "project" && status == "active"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),

              // Paused Projects
              S.listItem()
                .title('Paused')
                .child(
                  S.documentList()
                    .title('Paused Projects')
                    .filter('_type == "project" && status == "paused"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),

              // Archived Projects
              S.listItem()
                .title('Archived')
                .child(
                  S.documentList()
                    .title('Archived Projects')
                    .filter('_type == "project" && status == "archived"')
                    .defaultOrdering([{ field: 'publishedAt', direction: 'desc' }])
                ),
            ])
        ),

      S.divider(),

      // ====================================================================
      // TAGS SECTION
      // ====================================================================
      S.listItem()
        .title('Tags')
        .child(
          S.documentList()
            .title('Tags')
            .filter('_type == "tag"')
            .defaultOrdering([{ field: 'title', direction: 'asc' }])
        ),

      // ====================================================================
      // AUTHORS SECTION
      // ====================================================================
      S.listItem()
        .title('Authors')
        .child(
          S.documentList()
            .title('Authors')
            .filter('_type == "author"')
            .defaultOrdering([{ field: 'name', direction: 'asc' }])
        ),

      S.divider(),

      // ====================================================================
      // SETTINGS SECTION
      // ====================================================================
      S.listItem()
        .title('Site Settings')
        .child(
          S.document().schemaType('siteSettings').documentId('siteSettings').title('Site Settings')
        ),
    ])
