# static.prabhas.io

Markdown pages, served at the same path as the file:

| File | URL |
|------|-----|
| `policy/stellar-focus.md` | https://static.prabhas.io/policy/stellar-focus |

## Add a page

Drop a `.md` file anywhere in the repo and push. Dokploy rebuilds and serves it. The page title comes from the first `# Heading`. To override it, or to add a meta description, put front matter at the top:

```markdown
---
title: Custom tab title
description: Shown in search results and link previews
---
```

## Theme

- `assets/style.css`: all styling. Change the variables at the top to restyle every page (light and dark).
- `_includes/base.njk`: the HTML shell every page renders into.
- To give one page its own look, create `_includes/other.njk` and set `layout: other.njk` in that page's front matter.

## Run locally

```sh
npm install
npm run dev        # http://localhost:8080/policy/stellar-focus.html
```

## How it works

`Dockerfile` builds the site with [Eleventy](https://www.11ty.dev) and copies the HTML into a `caddy:2-alpine` image. `Caddyfile` serves `/policy/stellar-focus` from `policy/stellar-focus.html`, redirects `.html` URLs to the clean path, and serves `404.md` for missing pages. Caddy listens on plain HTTP port 80. TLS is handled in front of it by Traefik (Dokploy) and Cloudflare.

## Deploy (Dokploy)

1. Create Application → Provider: GitHub → this repo, branch `main`.
2. Build Type: **Dockerfile**, Docker File: `Dockerfile`.
3. Domains → add `static.prabhas.io`, container port **80**.
4. Deploy. Auto Deploy rebuilds on every push to `main`.
