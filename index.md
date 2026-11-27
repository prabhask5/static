---
templateEngineOverride: njk,md
description: Privacy policies and other static pages for prabhas.io projects.
---

# static.prabhas.io

Privacy policies and other static pages for [prabhas.io](https://prabhas.io) projects. Each page is a Markdown file in [prabhask5/static](https://github.com/prabhask5/static), served at the same path as the file.

## Pages

{{ collections.all | pageTree | safe }}
