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

## Home page

`index.md` is the page at `/`. It lists every page in file-tree order: folders first, then files, A→Z. The list is generated on each build, so a new page shows up there when you push it. To leave a page out, add `toc: false` to its front matter.

## Theme

- `assets/style.css`: all styling. Change the variables at the top to restyle every page (light and dark).
- `_includes/base.njk`: the HTML shell every page renders into.
- `assets/icon.svg`: the favicon (`apple-touch-icon.png` and `icon-512.png` are PNG copies; `icon-512.png` is also the Dokploy app icon).
- To give one page its own look, create `_includes/other.njk` and set `layout: other.njk` in that page's front matter.

## Run locally

```sh
npm install
npm run dev        # http://localhost:8080/policy/stellar-focus.html
```

## How it works

`Dockerfile` builds the site with [Eleventy](https://www.11ty.dev) and copies the HTML into a `caddy:2-alpine` image. `Caddyfile` serves `/policy/stellar-focus` from `policy/stellar-focus.html`, redirects `.html` URLs to the clean path, and serves `404.md` for missing pages. Caddy listens on plain HTTP port 80. TLS is handled in front of it by Traefik (Dokploy) and Cloudflare.

## Health check

`GET /health` returns `200 ok` with `Cache-Control: no-store`. The image's `HEALTHCHECK` calls it every 30 s, so Docker Swarm (Dokploy) restarts the container if Caddy stops answering.

The Uptime Kuma monitor is created by [dokploy-bridge](https://github.com/prabhask5/dokploy-bridge). Point the bridge at the health endpoint in the Dokploy app's description (otherwise it checks the home page):

```
health: /health
keyword: ok
```

## Deploy (Dokploy)

1. Create Application → Provider: GitHub → this repo, branch `main`.
2. Build Type: **Dockerfile**, Docker File: `Dockerfile`.
3. Domains → add `static.prabhas.io`, container port **80**.
4. Description → the `health:` / `keyword:` lines above.
5. Deploy. Auto Deploy rebuilds on every push to `main`.
