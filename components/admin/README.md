# Admin preview

Routes: `/admin`, `/admin/projects`, `/admin/posts`, `/admin/messages`, `/admin/settings`.

The shared shell uses the portfolio CSS tokens, including warm-white surfaces, navy text, cobalt actions, decorative accent surfaces, and their dark-theme counterparts.

## Current behavior

- Content starts from `lib/content.ts` and edits persist under `hope-admin-preview-v1` in this browser's localStorage.
- Projects and posts support search, status filters, editing, plain-text previews, draft saves, and preview-only publishing. Local drafts can be deleted after confirmation.
- The inbox starts empty. The explicitly labeled sample messages support read/unread and archive/restore actions.
- Settings save a profile, social links, and a résumé URL locally. Uploads and public-site updates are not connected.
- All admin routes return not found outside development. This is a temporary fail-closed boundary, not authentication. Do not expose the development server publicly.

## Backend integration

Replace the development gate with a verified server session and an explicit owner authorization check. Enforce the same authorization on every read/write endpoint; do not rely on client route checks or browser flags. Public signup must not grant admin access.

Replace the preview store with authenticated backend reads and mutations. Keep unpublished content and contact messages out of public responses. Connect public pages to published records, and connect the contact endpoint to the private inbox. Add controlled file storage for résumé uploads and server-side validation for content and links.
