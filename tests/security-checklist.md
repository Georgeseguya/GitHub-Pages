# Backend launch checks (requires a configured dedicated Supabase project)

Use a test owner and a separate non-owner account; never real sensitive records.

- Anonymous read returns published entries but no draft entries.
- Anonymous insert/update/delete fails or affects zero rows.
- A signed-in non-owner cannot read draft entries or insert/update/delete any entry.
- A non-owner cannot insert into greylad_owners, change memberships, or upload/delete files.
- An owner can create a draft, refresh the list, edit it, publish it and delete it.
- Refreshing the public page displays newly published entries; draft text remains absent.
- An owner can upload PDF/CSV/image files within the size limit and open the public resource link.
- Oversized files and unsupported types are rejected by Storage, even when calling its API directly.
- Sign out, then verify the studio is inaccessible until owner login.
- Remove owner membership using the dashboard while signed in. Subsequent write requests must fail or affect zero rows.
- Do not publish until all checks pass. Run Supabase Security Advisor and review any findings.

All authorization is enforced through grants and row-level security. Hiding the admin link is not a security control.
