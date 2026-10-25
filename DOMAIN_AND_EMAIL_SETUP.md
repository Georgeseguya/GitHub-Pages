# Domain and email setup (future)

Greylad's domain is not connected yet. Do not enter DNS records from sample guides verbatim; use the exact values supplied by the hosting and email providers when setting up the domain.

## Connect the future domain to Vercel

1. Import this existing GitHub repository into Vercel.
2. Use framework **Other**, production branch `main`, build command **none**, output directory `dist` (already set in `vercel.json`).
3. When the Greylad domain is registered and controlled, add it under Vercel Project → Domains.
4. Configure the domain's DNS registrar using the **A/CNAME** values displayed by Vercel; wait for verification and SSL.
5. Keep email DNS records separate from website A/CNAME settings.

## Custom domain email

Three related but different services:

- **Inbound forwarding:** e.g., `hello@your-domain` → existing personal inbox. Cloudflare Email Routing can forward for free when Cloudflare is the DNS manager, but forwarding alone does not provide a full mailbox or outgoing mail.
- **Two-way mailbox:** e.g., Zoho Mail or Google Workspace. Host receiving MX records and provide the ability to send as your new business address.
- **Transactional mail:** e.g., Resend with a verified sender domain. Used for automated forms, registration confirmations, security notifications and messages sent by website backend actions.

Set up the exact provider-specified **MX, SPF, DKIM and DMARC** records. Only one SPF TXT policy for the same hostname; merge legitimate senders into the same SPF record if instructed by your provider. Distinguish contact forms from simple `mailto:` links: forms need a hosted endpoint or an email provider API and must protect API keys on the server.

Current public contact in the site's bundled content is personal and intended to be temporary. Update `dist/index.html` and `dist/content.js` when official mailboxes are ready. The optional Supabase content admin needs a **separate** backend from VybaCash; do not commit service-role credentials.
