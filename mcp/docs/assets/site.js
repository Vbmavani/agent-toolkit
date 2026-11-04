// Shared nav and previous/next links for every MCP page.
// Load it as the first thing in <body>: the nav is written in place, so it shows with the page.
// To add a page, add it to PAGES in reading order.
(() => {
  const PAGES = [
    { path: "", label: "Overview", title: "What MCP is" },
    { path: "server.html", label: "Server", title: "The weather server" },
    { path: "client.html", label: "Client", title: "The client" },
    { path: "spec.html", label: "Spec reference", title: "Spec reference" },
    { path: "reference/census.html", label: "Census", title: "Server census" },
    { path: "reference/adoption.html", label: "Adoption", title: "Adoption in numbers" },
  ];
  const REPO = "https://github.com/Vbmavani/agent-toolkit";

  const me = document.currentScript;
  const root = me.src.replace(/assets\/site\.js(\?.*)?$/, "");
  const here = location.href.split(/[?#]/)[0].replace(/index\.html$/, "");
  const url = (p) => root + p;
  const current = PAGES.findIndex((p) => url(p.path) === here);

  const el = (tag, attrs, text) => {
    const n = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) n.setAttribute(k, v);
    if (text != null) n.textContent = text;
    return n;
  };

  const nav = el("nav", { class: "tk-nav", "aria-label": "MCP pages" });
  const inner = el("div", { class: "tk-nav-in" });
  inner.append(el("a", { class: "tk-brand", href: url("") }, "agent-toolkit · MCP"));
  const links = el("div", { class: "tk-links" });
  PAGES.forEach((p, i) => {
    const a = el("a", { class: "tk-link", href: url(p.path) }, p.label);
    if (i === current) a.setAttribute("aria-current", "page");
    links.append(a);
  });
  links.append(el("a", { class: "tk-link", href: REPO }, "GitHub ↗"));
  inner.append(links);
  nav.append(inner);
  me.after(nav);
  const cur = links.querySelector('[aria-current="page"]');
  if (cur) requestAnimationFrame(() => { links.scrollLeft = cur.offsetLeft - 16; });

  if (current < 0) return;
  const pager = el("nav", { class: "tk-pager", "aria-label": "Previous and next page" });
  const side = (i, dir) => {
    if (i < 0 || i >= PAGES.length) return el("span");
    const a = el("a", { class: "tk-step tk-" + dir, href: url(PAGES[i].path), rel: dir });
    a.append(el("small", null, (dir === "prev" ? "← Previous · " : "Next · ") + (i + 1) + " of " + PAGES.length),
             el("span", null, PAGES[i].title + (dir === "next" ? " →" : "")));
    return a;
  };
  pager.append(side(current - 1, "prev"), side(current + 1, "next"));
  const place = () => document.body.append(pager);
  document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", place) : place();
})();
