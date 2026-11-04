# MCP weather server and client

A TypeScript MCP weather server and a TypeScript MCP client that connects to it.

**Guide: [vbmavani.github.io/agent-toolkit/mcp](https://vbmavani.github.io/agent-toolkit/mcp/)**

**Every MCP component, grouped by role: [MCP-COMPONENTS.md](MCP-COMPONENTS.md)**

**Learn MCP the way I did, in 11 chapters: [vbmavani.github.io/mcp/learn](https://vbmavani.github.io/mcp/learn/)** (source: [docs/learn](docs/learn/))

| Folder | What it is |
|---|---|
| `weather-server-typescript/` | MCP server with weather tools backed by the US National Weather Service API |
| `mcp-client-typescript/` | MCP client that connects to a server and lets Claude call its tools |

## Run

```bash
cd weather-server-typescript && npm install && npm run build
cd ../mcp-client-typescript && npm install && npm run build
cp .env.example .env   # then add your ANTHROPIC_API_KEY
node build/index.js ../weather-server-typescript/build/index.js
```

See the README in each folder for details.

## The guide site

`docs/` is a small static site published at [vbmavani.github.io/agent-toolkit/mcp](https://vbmavani.github.io/agent-toolkit/mcp/) by `.github/workflows/pages.yml`. Its pages, in reading order:

| # | Page | Source | What it covers |
|---|---|---|---|
| 1 | [Overview](https://vbmavani.github.io/agent-toolkit/mcp/) | `docs/index.html` | What MCP is, how a tool call flows, and the learning path |
| 2 | [Server](https://vbmavani.github.io/agent-toolkit/mcp/server.html) | `docs/server.html` | Walkthrough of `weather-server-typescript` |
| 3 | [Client](https://vbmavani.github.io/agent-toolkit/mcp/client.html) | `docs/client.html` | Walkthrough of `mcp-client-typescript` and its tool loop |
| 4 | [Spec reference](https://vbmavani.github.io/agent-toolkit/mcp/spec.html) | `docs/spec.html` | Every part of MCP (spec 2026-07-28) as one object, with every allowed value |
| 5 | [Census](https://vbmavani.github.io/agent-toolkit/mcp/reference/census.html) | `docs/reference/census.html` | Official MCP servers from 16 large companies and every tool |
| 6 | [Adoption](https://vbmavani.github.io/agent-toolkit/mcp/reference/adoption.html) | `docs/reference/adoption.html` | SDK downloads, registry growth and survey figures (data in `docs/reference/data/`) |

The nav bar and *Previous / Next* links come from `docs/assets/site.js`. To add a page, add it to the `PAGES` list there and load `assets/site.js` first thing in the page's `<body>`.

Based on [modelcontextprotocol/quickstart-resources](https://github.com/modelcontextprotocol/quickstart-resources) (MIT).
