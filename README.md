# agent-toolkit

A workshop for building and learning the components of AI agents, one component at a time. Each component gets its own folder with working code and notes.

| Component | Folder | Status |
|---|---|---|
| MCP (Model Context Protocol) | [`mcp/`](mcp/) | Done |
| Context engineering & memory | — | Next |
| Subagents & orchestration | — | Next |
| Evals | — | Planned |

## MCP

[MCP](https://modelcontextprotocol.io) is an open standard for connecting an agent to tools and data. A **server** exposes tools, resources and prompts. A **client** (inside a host such as Claude Desktop or Claude Code) connects to servers and hands their tools to the model.

`mcp/` has a working server, a client that talks to it, and a guide site that ties them together.

**Start here: [vbmavani.github.io/agent-toolkit/mcp](https://vbmavani.github.io/agent-toolkit/mcp/)**. The guide is seven connected pages, in reading order: Overview → Learn MCP (11 chapters, starting with a day-by-day log of how I learned it) → Server → Client → Spec reference → Census → Adoption. Every page has the same nav bar and *Previous / Next* links.

| Folder | What it is |
|---|---|
| [`mcp/weather-server-typescript/`](mcp/weather-server-typescript/) | MCP server for US weather from the National Weather Service API |
| [`mcp/mcp-client-typescript/`](mcp/mcp-client-typescript/) | Chatbot client: launches a server, lists its tools and lets Claude call them |
| [`mcp/docs/`](mcp/docs/) | The guide site: overview, server and client walkthroughs, the spec reference, and background pages on the MCP landscape |

### What the weather server covers

| MCP feature | In this server |
|---|---|
| **Tools** | `get-forecast` (latitude, longitude) and `get-alerts` (two-letter US state code) |
| **Structured content** | Both tools declare an `outputSchema` and return `structuredContent`; `get-alerts` returns a top-level array, first allowed in spec 2026-07-28 |
| **Resources** | `weather://alerts/{state}` and `weather://rotate/{states}` templates |
| **Resource subscriptions** | In HTTP mode, clients can subscribe and get notified when alerts change |
| **MCP Apps (UI)** | `get-alerts` ships an interactive alerts widget (`ui://weather/alerts.html`) that hosts like Claude Desktop render next to the result |
| **Elicitation (URL mode)** | `open-facebook-login` asks the client to open a page in the browser |
| **Transports** | stdio by default; Streamable HTTP with `--http` (port 3333, or `PORT`) |
| **Version negotiation** | Serves both the 2026-07-28 and 2025-11-25 protocol versions |

### What the client covers

- Launches a server over stdio (`.js` with `node`, `.py` with `python`)
- Lists the server's tools and passes them to Claude, which calls them while answering
- Validates results against each tool's `outputSchema`; sends `content` to the model and uses `structuredContent` as data
- Negotiates the protocol version automatically (`versionNegotiation: { mode: 'auto' }`)
- Without an `ANTHROPIC_API_KEY`, it still connects, prints the tools and exits, which is useful for checking the wiring

### Run it

Requires Node.js 24+.

```bash
cd mcp/weather-server-typescript && npm install && npm run build
cd ../mcp-client-typescript && npm install && npm run build
cp .env.example .env   # then add your ANTHROPIC_API_KEY
node build/index.js ../weather-server-typescript/build/index.js
```

Ask something like "What's the weather in Sacramento?". Type `quit` to exit.

To try resource subscriptions, run the server over HTTP and listen for changes:

```bash
cd mcp/weather-server-typescript
node build/index.js --http
node scripts/listen.mjs FL   # in a second terminal
```

See the README in each folder for details.

### History

Moved from [Vbmavani/mcp](https://github.com/Vbmavani/mcp) with its commit history. The unmerged branches `feat/prompts-demo` and `feat/deploy-render` are still only in that repo.

## Coming next

- **Context engineering & memory**: what goes into the context window, compaction, prompt caching, and short-term vs long-term memory.
- **Subagents & orchestration**: splitting work across agents with clean contexts, handoffs, fan-out, and verifier loops.
- **Evals**: measuring whether a change to an agent actually makes it better.
