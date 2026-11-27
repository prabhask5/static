// Every .md file in this repo becomes a page at the same path:
//   policy/stellar-focus.md  ->  static.prabhas.io/policy/stellar-focus
export default function (eleventyConfig) {
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
