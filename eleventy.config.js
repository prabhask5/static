// Every .md file in this repo becomes a page at the same path:
//   policy/stellar-focus.md  ->  static.prabhas.io/policy/stellar-focus

// "/policy/stellar-focus.html" -> "/policy/stellar-focus", "/index.html" -> "/"
const cleanUrl = (url) => String(url).replace(/(index)?\.html$/, "");

const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

// Nested <ul> of every page, in file-tree order: folders first, then files, each A→Z.
// Leaves out the home page, the 404 page, and any page with `toc: false`.
function pageTree(pages) {
  const root = { dirs: new Map(), files: [] };
  for (const p of pages) {
    if (!p.url || ["/index", "/404"].includes(p.filePathStem) || p.data.toc === false) continue;
    const parts = p.filePathStem.split("/").filter(Boolean);
    const name = parts.pop();
    let node = root;
    for (const dir of parts) {
      if (!node.dirs.has(dir)) node.dirs.set(dir, { dirs: new Map(), files: [] });
      node = node.dirs.get(dir);
    }
    node.files.push({ name, title: p.data.title, url: cleanUrl(p.url) });
  }

  const byName = (a, b) => a.localeCompare(b, "en", { numeric: true });
  const render = (node) => {
    const dirs = [...node.dirs.keys()].sort(byName).map(
      (d) => `<li class="toc-dir"><span class="toc-folder">${escapeHtml(d)}/</span>${render(node.dirs.get(d))}</li>`,
    );
    const files = node.files
      .sort((a, b) => byName(a.name, b.name))
      .map(
        (f) =>
          `<li class="toc-file"><a href="${escapeHtml(f.url)}">${escapeHtml(f.title)}</a> <code>${escapeHtml(f.url)}</code></li>`,
      );
    return `<ul class="toc">${dirs.join("")}${files.join("")}</ul>`;
  };
  return root.dirs.size || root.files.length ? render(root) : "<p>No pages yet.</p>";
}

export default function (eleventyConfig) {
  eleventyConfig.addFilter("cleanUrl", cleanUrl);
  eleventyConfig.addFilter("pageTree", pageTree);

  // Repo files that are not pages.
  eleventyConfig.ignores.add("README.md");
  eleventyConfig.ignores.add("node_modules/**");

  // Theme assets are copied as-is.
  eleventyConfig.addPassthroughCopy("assets");

  // Every page uses the base layout unless its front matter says otherwise.
  eleventyConfig.addGlobalData("layout", "base.njk");

  // Write foo/bar.md to foo/bar.html; Caddy serves it at /foo/bar.
  eleventyConfig.addGlobalData("permalink", () => (data) => {
    if (data.page.outputFileExtension !== "html") return false;
    return `${data.page.filePathStem}.html`;
  });

  // Page title: front matter `title`, else the first "# Heading" in the file.
  eleventyConfig.addGlobalData("eleventyComputed", {
    title: (data) => {
      if (data.title) return data.title;
      const match = (data.page.rawInput || "").match(/^#\s+(.+)$/m);
      return match ? match[1].trim() : data.site.name;
    },
  });

  return {
    dir: { input: ".", includes: "_includes", data: "_data", output: "_site" },
    markdownTemplateEngine: false, // treat .md as plain Markdown, not templates
  };
}
