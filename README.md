# MCP weather server and client

A TypeScript MCP weather server and a TypeScript MCP client that connects to it.

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

## Contributing

`main` is protected. Make changes on a branch and open a pull request.

Based on [modelcontextprotocol/quickstart-resources](https://github.com/modelcontextprotocol/quickstart-resources) (MIT).
