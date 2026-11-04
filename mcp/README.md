# MCP weather server and client

A TypeScript MCP weather server and a TypeScript MCP client that connects to it.

**Live MCP reference page: [vbmavani.github.io/agent-toolkit/mcp](https://vbmavani.github.io/agent-toolkit/mcp/)**

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

## MCP reference page

[vbmavani.github.io/agent-toolkit/mcp](https://vbmavani.github.io/agent-toolkit/mcp/) shows every part of MCP (spec 2026-07-28) as one object, with a dropdown of every allowed value. The source is `docs/index.html`, published by the Pages workflow in `.github/workflows/pages.yml`.

### Reference pages

Background reading linked from the reference page's footer. Not needed to learn MCP itself.

| Page | Source | What it shows |
|---|---|---|
| [MCP Server Census](https://vbmavani.github.io/agent-toolkit/mcp/reference/census.html) | `docs/reference/census.html` | Official MCP servers from 16 large software companies: tool counts, hosting, sign-in and every tool |
| [MCP Adoption in Numbers](https://vbmavani.github.io/agent-toolkit/mcp/reference/adoption.html) | `docs/reference/adoption.html` | SDK downloads, official registry growth, GitHub repos and reported survey figures, through October 2026 |

The adoption page's data is also in `docs/reference/data/` as CSV files.

Based on [modelcontextprotocol/quickstart-resources](https://github.com/modelcontextprotocol/quickstart-resources) (MIT).
